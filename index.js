const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { json } = require('body-parser');

const POST = 5000;
const app = express();
const DBHOST = 'localhost';
const DBPOST = 27017;
const DBNAME = "documents";

mongoose.connect(`mongodb://${DBHOST}:${DBPOST}/${DBNAME}`,
    { useNewUrlParse: true, useUnifiedTopology: true},
    err => {
        if(err){
            console.log("Conected to mongoDB")
        }
    })

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const CategorySchema =  mongoose.Schema({
    name: String
})

const DocumentSchema = mongoose.Schema({
    link: String,
    createTime: Date,    
    source: String,
    categories: [CategorySchema],
});

  // const document = new DocumentModel({
    //     link: "link drive",
    //     createTime: new Date(),    
    //     source: 'Hieu Mon',
    //     categories: [
    //         { 
    //             name: 'Hoa'
    //         },{
    //             name: 'De thi'
    //         }],
    //     })

const DocumentModel = mongoose.model('document', DocumentSchema)

//create document
app.post('/documents', (req, res) => {
    const { link, createTime, source, categories} = req.body();  
    const document = new DocumentModel({       
        link: link,
        createTime: new Date(),    
        source: source,
        categories: categories
    })
    document.save().then(() => {
        res.send("Imported!")
    })
})

//get document
app.get('/documents', (req, res) => {
    DocumentModel.find((err, data) => {
        if(err) {
            console.log(err);
            res.send("Something went wrong!")
        }
        res.json(data)
    })
})

//update document
app.put('/documents/:id', (req, res) => {
    const {id, link, source, categories} = req.body();
    DocumentModel.updateOne (
        {_id: id},
        {link: link},
        {source: source},
        {categories: categories}
    )    
})


//delete document
app.delete("/students/:id", (req, res) => {
    DocumentModel.deleteOne({_id: req.params.id}).then(() => {
        res.send("Deleted!")
    })
})


app.listen( POST, () => {
    console.log("App start at " + POST)
})