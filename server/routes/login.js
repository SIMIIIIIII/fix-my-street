var express = require('express');
const User = require('../model/user');
const bcrypt = require('bcrypt');
var router = express.Router();

router.post("/", async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        
        if (!username || !password) {
            res.status(400).json({
                error: "Username and password requiried"
            });
            return
        }
        
        const user = await User.findOne({ "username": username });
        if (user === null){
            res.status(401).json({
                error: "Incorrect username"
            });
            return
        }
        
        if (!user.password) {
            res.status(401).json({
                error: "Account configuration error"
            });
            return
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({
                error: "Incorrect password"
            });
            return
        }
        
        req.session.user = user;
        
        res.status(200).json({
            message: "Login successful",
            user: req.session.user
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: "Erreur serveur"
        });
    }
});

module.exports = router;