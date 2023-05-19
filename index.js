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

const io = new Server(server, {
    cors:{
        origin: "http://127.0.0.1:5173",
        methods: ['GET', 'PUT', 'POST'],
        credentials: true
    },
});

const ideaWall = {
    "nodes":[
        { id: 1, title: 'Node 1', content: 'brain not found'},
        { id: 2, title: 'Node 2', content: 'brain not found'},
        { id: 3, title: 'Node 3', content: 'brain not found' }
    ],
    "edges":[
        { from: 1, to: 3 },
        { from: 1, to: 2 },
        { from: 3, to: 3 }
    ]
}

app.use(cors({
    origin: "http://127.0.0.1:5173",
    methods: ['GET', 'PUT', 'POST'],
    credentials: true
}));
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: false }));

io.on("connection", (socket) => {
    console.log(`${socket.id} a user connected`);
    //create card
    socket.on("taskItemCreated", async (data) => {
        const { selectedcolumn, item, kanbanData } = data;
        kanbanData[selectedcolumn].task.push(item);
        const { title, content, labels, assignees } = item;
        const creatTask = await Task.create({
            id: 111,
            title: title,
            content: content,
            labels: labels,
            assignees: assignees,
            columnId : kanbanData[selectedcolumn].id
        }).then(
            result => {
                console.log(result)
                io.sockets.emit("taskItems", result);
            }
        )
        
    })
    //update card
    socket.on("cardUpdated", (data) =>{
        const { cardData, index, columnIndex, kanbanData} = data;
        kanbanData[columnIndex].task.splice(index, 1);
        kanbanData[columnIndex].task.splice(
            index,
            0,
            cardData
        );
        io.sockets.emit("taskItem", kanbanData);
    })
    //delete card
    
    //drag card
    socket.on("cardItemDragged", (data) => {
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
        io.sockets.emit("taskItems", kanbanData);
    });

    socket.on("disconnect", () => {
        console.log(`${socket.id} a user disconnected`)
    });
});

//api routes
app.use('/users', require('./routes/user'));
app.use('/projects', require('./routes/project'))
app.use('/kanbans', require('./routes/kanban'))

app.get("/ideaWall", (req, res) => {
    res.json(ideaWall);
});

//error handling
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
});

// sync database
sequelize.sync()
    .then(result => {
    console.log("Database connected");
    server.listen(3000);
    })
    .catch(err => console.log(err));


// server.listen(3000, () => {
//     console.log('server is running');
// });