const User = require('../models/user');
const bcypt  = require('bcrypt');
const saltRounds = 10;
const {sign} = require('jsonwebtoken');

//get all users
exports.getUsers = (req, res) =>{
    User.findAll()
        .then(users =>{
            res.status(200).json({ user: users})
        })
        .catch(err => console.log(err));
}

//get user by id
exports.getUser = (req, res) =>{
    const userId = req.params.userId;
    User.findByPk(userId)
        .then(user =>{
            if(!user){
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ user:user });
        })
        .catch(err => console.log(err));
}

// login user
exports.loginUser = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
        User.findAll({
            where:{
                username: username
            }
        })
        .then(result => {
            if(result){
                bcypt.compare(password, result[0].password, (err, response) =>{
                    if(response){
                        const username = result[0].username;
                        const id = result[0].id;
                        const accessToken = sign(
                                {username: username, id:id}, 
                                "importantsecret"
                        );
                        res.json({accessToken, username, id});
                    }else{
                        res.status(404).json({message: 'Wrong Username or Password!'});
                        console.log(err);
                    }
                });
            };
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({message: 'Wrong Username or Password!'})
        });
}

// register user
exports.registerUser = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const role = req.body.role;
    bcypt.hash(password, saltRounds, (err, hash) => {
        if(err){
            console.log(err)
        };
        User.create({
            username: username,
            password: hash,
            role:role
        })
        .then(result => {
            const username = result.username;
            const id = result.id;
            const accessToken = sign(
                    {username: username, id:id}, 
                    "importantsecret"
            );
            console.log(result);
            res.status(201).json({accessToken, username, id});
        })
        .catch(err => console.log(err));
    }); 
}

//update user
exports.updateUser = (req, res) => {
    const userId = req.body.userId;
    const updatedusername = req.body.username;
    const updatedpassword = req.body.password;
    bcypt.hash(updatedpassword, saltRounds, (err, hash) => {
        if(err){
            console.log(err)
        };
        User.findByPk(userId)
        .then(user => {
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }
        user.username = updatedusername;
        user.password = hash;
        return user.save();
        })
        .then(result => {
        res.status(200).json({message: 'User updated!'});
        })
        .catch(err => console.log(err));
    })
}

// delete user
exports.deleteUser = (req, res) => {
    const userId = req.body.userId;
    User.findByPk(userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found!' });
            }
            return User.destroy({
                where: {
                id: userId
                }
            });
        })
        .then(result => {
            res.status(200).json({ message: 'User deleted!' });
        })
        .catch(err => console.log(err));
}