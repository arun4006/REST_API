const User = require('../models/User.model.js');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { json } = require('body-parser');


// Create and Save a new User
exports.create = async (req, res) => {
    // Validate request
    try {
        var emailalready = await User.findOne({ email: req.body.email })

        if (emailalready) {
            return res.status(400).send("Email already used..Try New");
        }

        var hash = await bcrypt.hash(req.body.password, 10)
        // Create a User
        const users = new User({
            username: req.body.username || "Unusernamed User",
            email: req.body.email,
            password: hash
             
            
        });

        // Save User in the database
        users.save()
            .then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the User."
                });
            });
    }
    catch (err) {
        res.send('error occured.')
    }
};

exports.login = async (req, res) => {
    // Validate request
    try {
        var emailalready = await User.findOne({ email: req.body.email })

        if (!emailalready) {
            return res.status(400).send("Email not exist");
        }

        var validpsw = await bcrypt.compare(req.body.password, emailalready.password)

        if (!validpsw) {
            return res.status(400).json("Password not valid")
        }

        var usertoken = jwt.sign({ username: emailalready.username }, 'techq')
        res.header('auth', usertoken).send(usertoken);
    }
    catch (err) {
        res.send('error occured.')
    }
};

exports.validUser=(req,res,next)=>{
    var token=req.header('auth');
    req.token=token;
    next();
}

// Retrieve and return all Users from the database.
exports.findAll = async (req, res) => {
    jwt.verify(req.token,'techq',async(err,data)=> {
        if(err){ res.sendStatus(403);}
        else{  
              const data = await User.find();
              res.json(data); 
            }
        });
}



// Find a singl User with a UserId
exports.findOne = (req, res) => {
    User.findById(req.params.UserId)
        .then(users => {
            if (!users) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.UserId
                });
            }
            res.send(users);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.UserId
                });
            }
            return res.status(500).send({
                message: "Error retrieving User with id " + req.params.UserId
            });
        });
};

// Update a User identified by the UserId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body.password) {
        return res.status(400).send({
            message: "User password can not be empty"
        });
    }

    // Find User and update it with the request body
    User.findByIdAndUpdate(req.params.UserId, {
        username: req.body.username || "Unusernamed User",
        email: req.body.email,
        password: req.body.password
    }, { new: true })
        .then(users => {
            if (!users) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.UserId
                });
            }
            res.send(users);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.UserId
                });
            }
            return res.status(500).send({
                message: "Error updating User with id " + req.params.UserId
            });
        });
};

// Delete a User with the specified UserId in the request
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.UserId)
        .then(users => {
            if (!users) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.UserId
                });
            }
            res.send({ message: "User deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.UserId
                });
            }
            return res.status(500).send({
                message: "Could not delete User with id " + req.params.UserId
            });
        });
};


