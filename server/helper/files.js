const fs = require("fs").promises;
const path = require("path");

const files = {
    /*
    * Read a Json file and return a structure
    *
    * args: String, a path to a Json file
    * 
    * return: a structure contening parses datas
    */
    readFile: async (filename) => {
        
        try {
            if (!filename.includes(".json")) {
                throw new Error("A JSON file required");
            }
            const filePath = path.join(__dirname, `../datas/${filename}`);
            const data = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(data);

        } catch (err) {
            console.error("Error reading file:", err);
            throw err;
        }
    },

   /*
    * Write a structure in a json file in the datas folder
    *
    * args:
    *       - structure: a structure to right
    *       - String: the name of the file (without the extension .json)
    * 
    * return: a structure contening parses datas
    */
    writeFile: async (data, filename) => {
        try {
            const filePath = path.join(__dirname, `../datas/${filename}.json`);
            await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
            console.log("File saved successfully!");
            return true;
        } catch (err) {
            console.error("Error writing file:", err);
            throw err;
        }
    }
};

module.exports = { JSONfiles: files };