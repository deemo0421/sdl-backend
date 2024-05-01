const Idea_wall = require('../models/idea_wall');
const { Op } = require("sequelize");

//to do name change to stage substage
exports.getIdeaWall = async(req, res) =>{
    const projectId = req.params.projectId;
    const stage = req.params.stage;
    const subStage = req.params.subStage;
    console.log("stage",stage);
    console.log("subStage",subStage);
    await Idea_wall.findOne({
        where:{
            [Op.and]: [
                { projectId:projectId },
                { stage:stage },
                { subStage:subStage}
            ]   
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
    const stage = req.query.stage;
    const subStage = req.query.subStage;
    await Idea_wall.findAll({
        where:{
            [Op.and]: [
                { projectId:projectId },
                { stage:stage },
                { subStage:subStage}
            ]   
        }
    })
    .then(result =>{
        res.status(200).json(result[0])
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
