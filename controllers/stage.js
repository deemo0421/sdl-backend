const Project = require('../models/project');
const Process = require('../models/process');
const Stage = require('../models/stage');
const Sub_stage = require('../models/sub_stage');

exports.getSubStage = async (req, res) =>{
    const projectId = req.body.projectId; 
    const currentStage = req.body.currentStage;
    const currentSubStage = req.body.currentSubStage;
    const process = await Process.findAll({ 
        attributes:[
            'id', 
            'stage', 
        ],
        where :{
            projectId:projectId
        },
        
    })
    const stage = await Stage.findAll({ 
        attributes:[
            'id', 
            'name', 
            'sub_stage'
        ],
        where :{  
            id:process[0].stage[currentStage-1]
        },
    })

    const sub_stage = await Sub_stage.findAll({ 
        attributes:[
            'id', 
            'name', 
            'description', 
            'userSubmit', 
        ],
        where :{
        id:stage[0].sub_stage[currentSubStage-1]
        },
    })
    .then(result =>{
        console.log(result);
        res.status(200).json(result[0])
    })
    
}

exports.getWholeStage = async(req, res) =>{
    const projectId = req.params.projectId;
}