const Kanban = require('../models/kanban');
const Column = require('../models/column');



exports.getKanban = (req, res, next ) => {
}


exports.createKanban = async(req, res, next ) => {
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

exports.updateKanban = (req, res, next ) => {
}


exports.deleteKanban = (req, res, next ) => {
}