const { Client } = require('pg')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/user')
const config = require('../config/config')

exports.register = async (req, res) => {
    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hasPassword = await bcrypt.hash(req.body.password, salt);

    // Create an user object
    let user = {
        email: req.body.email,
        username: req.body.username,
        password: hasPassword,
        user_type: req.body.user_type
    }

    // Save User in the database
    User.create(user, (err, insertedUser) => {
        if (err) {
          console.error('Error creating user:', err);
        } else {
          console.log('User created successfully:', insertedUser);
        }
      
        // Close the connection pool (you might want to keep it open if your application is long-running)
        // Client.end();
    });

}


exports.login = async (req, res) => {
    User.login({ email: req.body.email }, async (err, user) => {
        if (err) {
            console.log(err)
        } else {
            if (user) {
                const validPass = await bcrypt.compare(req.body.password, user.password);
                if (!validPass) return res.status(401).send("Mobile/Email or Password is wrong");

                // Create and assign token
                let payload = { id: user._id, user_type_id: user.user_type_id };
                const token = jwt.sign(payload, config.TOKEN_SECRET,{
                    expiresIn: 3600, // Set to one hour (3600 seconds)
                });

                res.status(200).header("auth-token", token).send({ "token": token });
            }
            else {
                res.status(401).send('Invalid mobile')
            }

        }
    })
}

exports.checkAuthorised = async (req, res) =>{
    res.send({'status':true})
}