const express = require('express');
const sequelize = require('./util/database');
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();
const http = require('http');
const {Server} = require('socket.io');
const { Socket } = require('dgram');
const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin: "http://127.0.0.1:5173",
        methods: ['GET', 'PUT', 'POST'],
        credentials: true
    },
});


let kanbanData = [
    {
        "name":"ToDo",
        "items": [
            {
                "id":1,
                "title": "website redesign.",
                "content":"dashboard",
                "labels":[
                    {
                        "content":"優先處理",
                        "bgcolor":"bg-blue-500",
                        "textcolor":"text-white",
                    }
                ],
                "assignees": [
                    {
                        "userId": "Wuret",
                        "bgcolor":"bg-purple-100"
                    },
                    {
                        "userId": "YY",
                        "bgcolor":"bg-purple-50"
                    }
                ]
            },
            {
                "id":2,
                "title": "react",
                "content":"cra is dead",
                "labels":[
    
                ],
                "assignees": [
                    {
                        "userId": "YY",
                        "bgcolor":"bg-purple-50"
                    }
                ]
            }
        ]
    },
    {
        "name":"In Progress",
        "items": [
            {
                "id":3,
                "title": "vite",
                "content":"veet",
                "labels":[
    
                ],
                "assignees": [
                    {
                        "userId": "YY",
                        "bgcolor":"bg-purple-50"
                    }
                ]
            }
        ]
    },
    {
        "name":"Completed",
        "items": [
            {
                "id":4,
                "title": "react-beautiful-dnd",
                "content":"react-beautiful-dnd",
                "labels":[
    
                ],
                "assignees": [
                    {
                        "userId": "Wuret",
                        "bgcolor":"bg-purple-100"
                    }
                ]
            },
            {
                "id":5,
                "title": "react-dnd",
                "content":"react-dnd",
                "labels":[
    
                ],
                "assignees": [
                    {
                        "userId": "Dnd",
                        "bgcolor":"bg-purple-200"
                    }
                ]
            }
        ]
    }
];

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
    socket.on("cardItemCreated", (data) => {
        const { selectedcolumn, item } = data;
        kanbanData[selectedcolumn].items.push(item);
        io.sockets.emit("cardItems", kanbanData);
    })
    //update card
    socket.on("cardUpdated", (data) =>{
        const { cardData, index, columnIndex} = data;
        kanbanData[columnIndex].items.splice(index, 1);
        kanbanData[columnIndex].items.splice(
            index,
            0,
            cardData
        );
        io.sockets.emit("cardItem", kanbanData);
    })
    //delete card
    
    //drag card
    socket.on("cardItemDragged", (data) => {
        const { destination, source } = data;
        const dragItem = {
            ...kanbanData[source.droppableId].items[source.index],
        };
        kanbanData[source.droppableId].items.splice(source.index, 1);
        kanbanData[destination.droppableId].items.splice(
            destination.index,
            0,
            dragItem
        );
        io.sockets.emit("cardItems", kanbanData);
    });

    socket.on("disconnect", () => {
        console.log(`${socket.id} a user disconnected`)
    });
});

//api routes
app.use('/users', require('./routes/user'));
app.use('/projects', require('./routes/project'))
app.use('/kanbans', require('./routes/kanban'))

//to do ...
app.get("/kanban", (req, res) => {
    res.json(kanbanData);
});
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