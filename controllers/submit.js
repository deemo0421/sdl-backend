const Submit = require('../models/submit')
const Project = require('../models/project')
const Idea_wall = require('../models/idea_wall');
const Process = require('../models/process');
const Stage = require('../models/stage');

exports.createSubmit = async(req, res) => {
    const {currentStage, currentSubStage, content, projectId} = req.body;
    const currentStageInt = parseInt(currentStage);
    const currentSubStageInt = parseInt(currentSubStage);
    if(!content){
        return res.status(404).send({message: 'please fill in the form !'})
    }
    console.log(req.files);
    if(req.files.length > 0){
        req.files.map(item => {
            const filename = item.filename
            Submit.create({
                stage: `${currentStageInt}-${currentSubStageInt}`,
                content: content,
                projectId: projectId,
                filename:filename
            })
            .catch(err => {
                console.log(err)
                return res.status(500).send({message: 'create failed!'});
            });
        })
    }else{
        await Submit.create({
            stage: `${currentStageInt}-${currentSubStageInt}`,
            content: content,
            projectId: projectId,
        })
    }
    //check next stage
    const process = await Process.findAll({ 
        attributes:[
            'stage', 
        ],
        where :{
            projectId:projectId
        },
        
    })
    const stage = await Stage.findAll({ 
        attributes:[
            'sub_stage'
        ],
        where :{  
            id:process[0].stage[currentStageInt-1]
        },
    })
    console.log("stage[0].sub_stage.length",stage[0].sub_stage.length);
    if(currentSubStageInt+1 <= stage[0].sub_stage.length){
        await Project.update({
            currentSubStage:currentSubStageInt+1
        },{
            where:{
                id: projectId
            }
        })
        await Idea_wall.create({
            type:"project",
            projectId:projectId,
            stage:`${currentStageInt}-${currentSubStageInt+1}`
        })
        .then(() =>{
        return res.status(200).send({message: 'create success!'});
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send({message: 'create failed!'});
        })
    }else{
        await Project.update({
            currentStage:currentStageInt+1,
            currentSubStage:1
        },{
            where:{
                id: projectId
            }
        });
        await Idea_wall.create({
            type:"project",
            projectId:projectId,
            stage:`${currentStageInt+1}-${currentSubStageInt}`
        })
        .then(() =>{
        return res.status(200).send({message: 'create success!'});
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send({message: 'create failed!'});
        })
    }
}