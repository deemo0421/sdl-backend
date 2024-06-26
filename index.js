require('dotenv').config()
const express = require('express');
const sequelize = require('./util/database');
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();
const http = require('http');
const {Server} = require('socket.io');
const { Socket } = require('dgram');
const server = http.createServer(app);
const Task = require('./models/task');
const Column = require('./models/column');
const Node = require('./models/node');
const Node_relation = require('./models/node_relation');
const { rm } = require('fs');

const io = new Server(server, {
    cors:{
        origin: "http://localhost:5173",
        methods: ['GET', 'PUT', 'POST'],
        credentials: true
    },
});

app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'PUT', 'POST'],
    credentials: true
}));
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: false }));

io.on("connection", (socket) => {
    console.log(`${socket.id} a user connected`);
    //join room
    socket.on("join_room", (data) =>{
        socket.join(data);
        console.log(`${socket.id} join room ${data}`);
    })
    //send message
    socket.on("send_message", (data) =>{
        console.log(data);
        socket.to(data.room).emit("receive_message", data);
    })
    //create card
    socket.on("taskItemCreated", async (data) => {
        const { selectedcolumn, item, kanbanData } = data;
        const { title, content, labels, assignees } = item;
        const creatTask = await Task.create({
            title: title,
            content: content,
            labels: labels,
            assignees: assignees,
            columnId : kanbanData[selectedcolumn].id
        })
        const  addIntoTaskArray = await Column.findByPk(creatTask.columnId)
        addIntoTaskArray.task = [...addIntoTaskArray.task, creatTask.id];
        await addIntoTaskArray.save()
        .then(()=>console.log("success"))
        io.sockets.emit("createTaskItem", addIntoTaskArray);
    })
    //update card
    socket.on("cardUpdated", async(data) =>{
        const { cardData } = data;
        const updateTask = await Task.update(cardData,{
            where:{
                id : cardData.id
            }
        });
        io.sockets.emit("UpdateTaskItem", updateTask);
    })
    //drag card
    socket.on("cardItemDragged", async(data) => { 
        const { destination, source, kanbanData } = data;
        const dragItem = {
            ...kanbanData[source.droppableId].task[source.index],
        };
        kanbanData[source.droppableId].task.splice(source.index, 1);
        kanbanData[destination.droppableId].task.splice(
            destination.index,
            0,
            dragItem
        );
        io.sockets.emit("dragtaskItem", kanbanData);
        const sourceColumn = kanbanData[source.droppableId].task.map( item => item.id);
        const destinationColumn = kanbanData[destination.droppableId].task.map( item => item.id);
        await Column.update({task:sourceColumn},{
            where:{
                id: kanbanData[source.droppableId].id
            }
        });
        await Column.update({task:destinationColumn},{
            where:{
                id: kanbanData[destination.droppableId].id
            }
        });
        await Task.update({columnId:kanbanData[destination.droppableId].id},{
            where:{
                id: dragItem.id
            }
        });
    });
    //create nodes
    socket.on("nodeCreate", async(data) =>{
        const { title, content, ideaWallId, owner, from_id } = data;
        const createdNode = await Node.create({
            title:title,
            content:content,
            ideaWallId:ideaWallId,
            owner:owner
        });
        if(from_id){
            const nodeRelation = await Node_relation.create({
                from_id:from_id,
                to_id: createdNode.id,
                ideaWallId:ideaWallId
            })
        }
        io.sockets.emit("nodeUpdated", createdNode);
    })

    socket.on("nodeUpdate", async(data) =>{
        const { title, content, id} = data;
        const createdNode = await Node.update(
            {
                title:title,
                content:content
            },
            {
                where:{
                    id: id
                }
            }
        );
        io.sockets.emit("nodeUpdated", createdNode);
    })
    socket.on("nodeDelete", async(data) =>{
        const {id} = data;
        const deleteNode = await Node.destroy(
            {
                where:{
                    id: id
                }
            }
        );
        io.sockets.emit("nodeUpdated", deleteNode);
    })
    socket.on("disconnect", () => {
        console.log(`${socket.id} a user disconnected`)
    });
});

//api routes
app.use('/users', require('./routes/user'));
app.use('/projects', require('./routes/project'))
app.use('/kanbans', require('./routes/kanban'))
app.use('/ideaWall', require('./routes/ideaWall'))
app.use('/node', require('./routes/node'))
app.use('/daily', require('./routes/daily'))
app.use('/submit', require('./routes/submit'))
app.use('/stage', require('./routes/stage'))

//error handling
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
});

// sync database
sequelize.sync({alter:true})
    .then(() => {
    console.log("Database connected");
    server.listen(3000);
    })
    .catch(err => console.log(err));