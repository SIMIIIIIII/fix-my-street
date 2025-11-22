const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../model/user');

const helpers = {
    
    // Get today date 
    getDate : ()=>{
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const date = `${day}/${month}/${year}`;
        return date;
    },

    // Get date in DD/MM/YYYY format
    formattedDate: (date)=>{
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    },
    
    // Hash a password
    hashPassword: async (password) => {
        try {
            const hash = await bcrypt.hash(password, saltRounds);
            return hash;
        } catch (err) {
            console.error('Error hashing password:', err);
            throw err;
        }
    },

    /*
    * Add a liste of username in each document of the structure
    *
    * args: Structure, the structure to modify
    * 
    */
    formatListIncidents: async(incidents, userId) => {
        for (var i = 0; i < incidents.length; i++) {
            const incident = incidents[i];
            const user = await User.findById(incident.userId);
            
            // Convert to plain object if it's a Mongoose document
            if (incident.toObject) {
                incidents[i] = incident.toObject();
            }
            
            incidents[i].username = user ? user.username : 'Unknown';
            incidents[i].goodDate = helpers.formattedDate(incident.date);
            incidents[i].mine = userId && incident.userId.toString() === userId.toString();
        }
    },
}

module.exports = { helpers: helpers }