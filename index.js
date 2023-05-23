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
        origin: "http://127.0.0.1:5173",
        methods: ['GET', 'PUT', 'POST'],
        credentials: true
    },
});

const inquirySubStage = [
    {
        "id":1,
        "stageName": "形成問題",
        "subStage":[
            {
                "index":1,
                "subStagename":"決定研究主題"
            },
            {
                "index":2,
                "subStagename":"決定研究主題"
            }
        ]
    },{
        "id":2,
        "stageName":"規劃",
        "subStage":[
            {
                "index":1,
                "subStagename":"提出研究問題"
            },
            {
                "index":2,
                "subStagename":"訂定研究構想表"
            },
            {
                "index":3,
                "subStagename":"設計研究記錄表格"
            },
            {
                "index":4,
                "subStagename":"進行嘗試性研究"
            }
        ]

    },{
        "id":3,
        "stageName":"執行",
        "subStage":[
            {
                "index":1,
                "subStagename":"進行實驗並記錄"
            },
            {
                "index":2,
                "subStagename":"分析資料與繪圖"
            },
            {
                "index":3,
                "subStagename":"撰寫研究結果"
            },
            {
                "index":4,
                "subStagename":"進行嘗試性研究"
            }
        ]

    },{
        "id":4,
        "stageName":"形成結論",
        "subStage":[
            {
                "index":1,
                "subStagename":"進行研究討論"
            },
            {
                "index":2,
                "subStagename":"撰寫研究結論"
            }
        ]
    },{
        "id":5,
        "stageName":"展示與報告",
        "subStage":[
            {
                "index":1,
                "subStagename":"統整作品報告書"
            },
            {
                "index":2,
                "subStagename":"製作作品海報"
            },
            {
                "index":3,
                "subStagename":"影片整理"
            },
            {
                "index":4,
                "subStagename":"討論與省思"
            }
        ]
    },{
        "id":6,
        "stageName":"製作學習歷程",
        "subStage":[
            {
                "index":1,
                "subStagename":"整理學習歷程"
            },
            {
                "index":2,
                "subStagename":"製作學習歷程"
            }
        ]
    }
]

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
        io.sockets.emit("taskItems", addIntoTaskArray);
    })
    //update card
    socket.on("cardUpdated", async(data) =>{
        const { cardData, index, columnIndex, kanbanData} = data;
        const updateTask = await Task.update(cardData,{
            where:{
                id : cardData.id
            }
        });
        io.sockets.emit("taskItem", updateTask);
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

// app.get("/ideaWall", (req, res) => {
//     res.json(ideaWall);
// });
app.get("/stage/:subStage", (req, res) =>{
    const mainStage = req.params.subStage;
    if(mainStage === "1-1"){
        const stageContent = {
            "title":"1-1決定研究主題",
            "describe":"在 1-1 的階段中，提出你感興趣的主題，並提供完整資訊分享給通組的夥伴，並在與小組討論完後，繳交上傳。"
        };
        return res.status(200).json(stageContent)
    }else if(mainStage === "1-2"){
        const stageContent = {
            "title":"1-2決定研究題目",
            "describe":"根據剛剛所想的研究主題，蒐集相關資料，並和組員討論出合適的題目。。"
        };
        return res.status(200).json(stageContent)
    }else{
        return res.status(404).send({message: 'stage error!'})
    }
})

//error handling
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
});

// sync database
sequelize.sync({alter:true})  //{force:true} {alter:true}
    .then(result => {
    console.log("Database connected");
    server.listen(3000);
    })
    .catch(err => console.log(err));


// server.listen(3000, () => {
//     console.log('server is running');
// });