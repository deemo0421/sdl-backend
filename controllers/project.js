const Project = require('../models/project')
const User = require('../models/user')
const Kanban = require('../models/kanban');
const Column = require('../models/column');

// exports.getProject = async(req, res) =>{
//     const projectId = req.params.projectId;
//     Project.findByPk(projectId)
//         .then(result =>{
//             console.log(result);
//             res.status(200).json({ project: result})
//         })
//         .catch(err => console.log(err));
// }

exports.getAllProject = async(req, res) =>{
    const userId = req.query.userId;
    await Project.findAll({ 
        include:[{
            model:User,
            attributes:[],
            where :{
            id:userId
        },
        }] 
    })
    .then(result =>{
        console.log(result);
        res.status(200).json(result)
    })
    .catch(err => console.log(err));

    
    // user.getProject()
    //     .then(result =>{
    //         console.log(result);
    //         res.status(200).json({ project: result})
    //     })
    //     .catch(err => console.log(err));
}

exports.createProject = async(req, res) =>{
    const projectName = req.body.projectName;
    const projectdescribe = req.body.projectdescribe;
    const projectMentor = req.body.projectMentor;
    const createdProject = await Project.create({
        name: projectName,
        describe: projectdescribe,
        mentor: projectMentor
    });
    const userId = req.body.userId;
    console.log(userId);
    const creater = await User.findByPk(userId);
    const userProjectAssociations = await createdProject.addUser(creater);

    //initailize kanban
    const kanban = await Kanban.create({column:[], projectId:createdProject.id});
    const todo = await Column.create({name:"待處理", task:[], kanbanId:kanban.id});
    const inProgress = await Column.create({name:"進行中", task:[], kanbanId:kanban.id});
    const Completed = await Column.create({name:"完成", task:[], kanbanId:kanban.id});
    Kanban.findByPk(kanban.id)
    .then(kanban =>{
        kanban.column = [todo.id, inProgress.id, Completed.id ];
        return kanban.save();
    })
    .then(() =>{
        res.status(200).send({message: 'create success!'})
    })
    .catch(err => console.log(err));
}

// exports.updateProject = async(req, res) =>{
//     const projectId = req.body.projectId;
//     const projectName = req.body.projectName;
//     const projectdescribe = req.body.projectdescribe;
//     const projectMentor = req.body.projectMentor;
//     const userId = req.body.userId
//     Project.findByPk(projectId)
//     .then(project =>{
//         if(!project){
//             return res.status(404).json({ message: 'Project not found!' });
//         }
//         project.name = projectName;
//         project.describe = projectdescribe;
//         project.mentor = projectMentor;
//         project.userId = userId;
//         return project.save();
//     })
//     .then(() => {
//         res.status(200).json({message: 'project updated!'});
//     })
//     .catch(err => console.log(err));
// }

// exports.deleteProject = async(req, res) =>{
//     const projectId = req.body.projectId;
//     User.findByPk(projectId)
//         .then(project =>{
//             if (!project) {
//                 return res.status(404).json({ message: 'project not found!' });
//             }
//             return User.destroy({
//                 where: {
//                 id: projectId
//                 }
//             });
//         })
//         .then(result => {
//             res.status(200).json({ message: 'project deleted!' });
//         })
//         .catch(err => console.log(err));
// }