var express = require('express');
const { checkUserInput } = require('../tests/checkInput')
const User = require('../model/user');
const { helpers } = require('../helper/helper');
var router = express.Router();

router.post("/", async (req, res) => {
    const user = {}
    
    user.username = req.body.newUsername;
    if (!checkUserInput.isValidUsername(user.username)) {
        res.status(400).json({ 
            error: "The username must be at least 6 characters long." 
        });
        return
    }
    
    user.email = req.body.email;
    if (!checkUserInput.isValidEmail(user.email)){
        res.status(400).json({ 
            error: "Invalid email adress" 
        });
        return
    }
    
    user.password = req.body.newPassword;
    if (!checkUserInput.isValidPassword(user.password)){
        res.status(400).json({
            error: "Invalid passwork"
        });
        return
    }

    user.name = req.body.name;
    
    try {
        const emailExists = await User.findOne({"email" : user.email})
        if (emailExists !== null) {
            res.status(409).json({
                error: "A user already exists with this email address."
            });
            return
        }
        
        const usernameExists = await User.findOne({"username" : user.username})
        if (usernameExists !== null){
            res.status(409).json({
                error: "The username already exists"
            });
            return
        }
        
        user.password = await helpers.hashPassword(user.password);

        const newUser = new User(user);
        const savedUser = await newUser.save();
        
        req.session.user = savedUser;
        
        res.status(200).json({
            message: "Registration successful",
            user: req.session.user
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            error: "Erreur serveur"
        });
    }
});

module.exports = router;