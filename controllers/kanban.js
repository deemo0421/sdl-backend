const Kanban = require('../models/kanban');
const Column = require('../models/column');
const Task = require('../models/task');
const Project = require('../models/project');

exports.getKanban = async ( req, res ) => {
    const projectId = req.params.projectId;
    const kanbanData = await Kanban.findAll({
        attributes:['id','column'],
        where:{
            projectId : projectId
        },
    })
    const { id, column } = kanbanData[0];
    const columnData = await Column.findAll({
            attributes:['id','name','task'],
            where:{
                kanbanId : id
            }
    })
    .then( result => {
        res.status(200).json(result);
    })
    // const columnData = await Column.findAll({ kanbanId : })
}

exports.getKanbanTask = async ( req, res ) =>{
    const columnId = req.params.columnId;
    const taskData = await Task.findAll({
        attributes:['id', 'title', 'content', 'labels', 'assignees'],
        where:{
            columnId : columnId
        }
    })
    .then( result =>{
        res.status(200).json(result);
    })
    .catch( err => {
        console.log(err);
        res.status(500).send({message: 'Something Wrong!'})
    });
}
exports.createKanban = async ( req, res ) => {
    const projectId = req.body.projectId;
    const kanban = await Kanban.create({column:[], projectId:projectId});
    const todo = await Column.create({name:"待處理", task:[], kanbanId:kanban.id});
    const inProgress = await Column.create({name:"進行中", task:[], kanbanId:kanban.id});
    const Completed = await Column.create({name:"完成", task:[], kanbanId:kanban.id});
    Kanban.findByPk(kanban.id)
        .then(kanban =>{
            kanban.column = [todo.id, inProgress.id, Completed.id ];
            return kanban.save();
        })
        .then(() => {
            res.status(200).json({message: 'kanban created!'});
        })
        .catch(err => console.log(err));
    
    
    // await Kanban.create({
    //     column:[],
    //     projectId:projectId
    // }).then(result => console.log(result))
    // .catch(err => console.log(err));
}
