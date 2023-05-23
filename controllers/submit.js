const Submit = require('../models/submit')
const Project = require('../models/project')

exports.createSubmit = async(req, res) => {
    const {stage, title, content, projectId} = req.body;
    console.log(req.body);
    if(!title || !content){
        return res.status(404).send({message: 'please fill in the form !'})
    }
    console.log(req.files);
    if(req.files.length > 0){
        req.files.map(item => {
            const filename = item.filename
            Submit.create({
                stage: stage,
                title: title,
                content: content,
                projectId: projectId,
                filename:filename
            })
            .then(() =>{
                return res.status(200).send({message: 'create success!'})
            })
            .catch(err => {
                console.log(err)
                return res.status(500).send({message: 'create failed!'});
            });
        })
    }else{
        await Submit.create({
            stage: stage,
            title: title,
            content: content,
            projectId: projectId,
        })
    }
    await Project.update({
        mainStage:"1-2"
    },{
        where:{
            id: projectId
        }
    })
    .then(() =>{
        return res.status(200).send({message: 'create success!'});
    })
    .catch(err => {
        console.log(err);
        return res.status(500).send({message: 'create failed!'});
    });
}