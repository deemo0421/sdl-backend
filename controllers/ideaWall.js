const Idea_wall = require('../models/idea_wall');

//to do name change to stage substage
exports.getIdeaWall = async(req, res) =>{
    const projectId = req.params.projectId;
    const name = req.params.ideaWallname;
    await Idea_wall.findOne({
        where:{
            projectId:projectId,
            name:name
        }
    })
    .then(result =>{
        console.log(result);
        res.status(200).json(result)
    })
    .catch(err => console.log(err));
}

exports.getAllIdeaWall = async(req, res) =>{
    const projectId = req.query.projectId;
    await Idea_wall.findAll({
        where:{
            projectId:projectId
        }
    })
    .then(result =>{
        console.log(result);
        res.status(200).json(result)
    })
    .catch(err => console.log(err));
}

exports.createIdeaWall = async(req, res) =>{
    const projectId = req.body.projectId;
    const name = req.body.name;
    await Idea_wall.create({
        name:name,
        type:"project",
        projectId:projectId
    })
    .then(result =>{
        console.log(result);
        res.status(200).json(result)
    })
    .catch(err => console.log(err));
}
