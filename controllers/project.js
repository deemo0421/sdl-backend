const Project = require('../models/project')
const User = require('../models/user')
const Kanban = require('../models/kanban');
const Column = require('../models/column');
const shortid = require('shortid')
const Idea_wall = require('../models/idea_wall')

exports.getProject = async(req, res) =>{
    const projectId = req.params.projectId;
    await Project.findByPk(projectId)
        .then(result =>{
            console.log(result);
            res.status(200).json(result)
        })
        .catch(err => console.log(err));
}

exports.getAllProject = async(req, res) => {
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

exports.createProject = async(req, res) => {
    const projectName = req.body.projectName;
    const projectdescribe = req.body.projectdescribe;
    const projectMentor = req.body.projectMentor;
    const referral_code = shortid.generate();
    if(!projectName || !projectdescribe){
        return res.status(404).send({message: 'please enter project Name or project describe!'})
    }
    const createdProject = await Project.create({
        name: projectName,
        describe: projectdescribe,
        mentor: projectMentor,
        referral_code: referral_code,
        mainStage:"1-1"
    });
    const userId = req.body.userId;
    const creater = await User.findByPk(userId);
    const userProjectAssociations = await createdProject.addUser(creater);

    //initailize kanban
    const kanban = await Kanban.create({column:[], projectId:createdProject.id});
    const todo = await Column.create({name:"待處理", task:[], kanbanId:kanban.id});
    const inProgress = await Column.create({name:"進行中", task:[], kanbanId:kanban.id});
    const Completed = await Column.create({name:"完成", task:[], kanbanId:kanban.id});
    await Kanban.findByPk(kanban.id)
    .then(kanban =>{
        kanban.column = [todo.id, inProgress.id, Completed.id ];
        return kanban.save();
    })
    .catch(err => console.log(err));

    await Idea_wall.create({
        type:"project",
        projectId:createdProject.id,
        stage:"1-1"
    })
    .then(() =>{
        res.status(200).send({message: 'create success!'})
    })
    .catch(err => console.log(err));
}

exports.inviteForProject = async( req, res) => {
    const referral_Code = req.body.referral_Code;
    const userId = req.body.userId;
    console.log(userId);
    if(!referral_Code){
        return res.status(404).send({message: 'please enter referral code!'})
    }
    const referralProject = await Project.findOne({
        where:{
            referral_code:referral_Code
        }
    })
    const invited = await User.findByPk(userId);
    const userProjectAssociations = await referralProject.addUser(invited)
    .then(() => {
            return res.status(200).send({message: 'invite success!'})
    })
    .catch(err => {
        console.log(err);
        return res.status(500).send({message: 'invite failed!'})
    });

}

// exports.updateProject = async(req, res) => {
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

// exports.deleteProject = async(req, res) => {
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