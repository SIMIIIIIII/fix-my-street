const Incident = require('../model/incident');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const { JSONfiles } = require('./files');

const stopWords = /[.,\/#!$%\^&\*;:{}=\-_`~()]/;

const helpers = {
    /*
    * remove all stop word from a text
    *
    * args: String, the text to clean
    * 
    * return: a list of all words of in de text, with doublon
    */
    filter: (text) => {
        const tokens = tokenizer.tokenize(text.toLowerCase());

        return tokens
        .filter(i => !stopWords.test(i))
        .map(word => word.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
    },

    getTF: (text) => {
        const wordsFilter = helpers.filter(text);

        const tf = [];
        const used = [];
        const n = wordsFilter.length;

        for (let index = 0; index < n; index++) {
            const element = wordsFilter[index];

            if (!used.includes(element)){

                const count = wordsFilter.reduce((acc, word) => {
                    return word === element ? acc + 1 : acc;
                }, 0);

                tf.push({
                    "word": element,
                    "count": Math.log(1 + (count/n))
                });
                used.push(element);
            }
        }

        return {"tf": tf, "words": used}
    },
    
    getIDF: (TF) => {
        const IDF = [];
        const used = [];
        const n = TF.length;

        for (let i = 0; i < n; i++) {
            const words = TF[i].words;
            
            for (let j = 0; j < words.length; j++){
                const word = words[j].word;
                
                if (!used.includes(word)){
                    const count = TF.reduce((acc, doc) => {
                        return doc.list.includes(word) ? acc + 1 : acc;
                    }, 0)

                    IDF.push({
                        "word": word,
                        "count": Math.log(n/count)
                    })

                    used.push(word);
                }
                
            }
        }
        return IDF;
    },

    setTFIDF: (TF, IDF) => {
        for (let i = 0; i < TF.length; i++){
            TF[i].words.forEach(word => {
                const idf = IDF.find(m => m.word === word.word);
                word.count = word.count * (idf ? idf.count : 0);
            });
            TF[i].list = null;
        }
    },

    MAJsetTFIDF: async (doc, supprimer = false) => {
        let TF = await JSONfiles.readFile("TF.json");
        
        const temp = helpers.getTF(`${doc.description} ${doc.adress}`);
        const tempTF = {
            "indidentId": doc._id,
            "words": temp.tf,
            "list": temp.words
        };

        if (supprimer)TF = TF.filter(d => d.indidentId.toString() !== doc._id.toString());
        else TF.push(tempTF);

        await JSONfiles.writeFile(TF, "TF");
        
        const IDF = helpers.getIDF(TF);
        await JSONfiles.writeFile(IDF, "IDF");
        
        helpers.setTFIDF(TF, IDF);
        await JSONfiles.writeFile(TF, "TFIDF");
    }
}

const search = async () => {
    const incidents = await Incident.find();
    const TF = [];
        
    for (let i = 0; i < incidents.length; i++){
        const temp = helpers.getTF( `${incidents[i].description} ${incidents[i].adress}`);
        TF.push({
            "indidentId": incidents[i]._id,
            "words": temp.tf,
            "list": temp.words // will be later deleted or set to null
        })
    }

    await JSONfiles.writeFile(TF, "TF");

    const IDF = helpers.getIDF(TF);
    await JSONfiles.writeFile(IDF, "IDF");

    helpers.setTFIDF(TF, IDF);
    await JSONfiles.writeFile(TF, "TFIDF");
}

module.exports = {"search": search, "search_helpers": helpers};