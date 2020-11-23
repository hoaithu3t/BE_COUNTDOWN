const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { json } = require('body-parser');
const fakeData = require("./fakeData")

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

const DocumentSchema = mongoose.Schema({
    name: String,
    link: String,
    linkavt: String,
    createTime: Date,    
    source: String,
    subject: String,
    type: String
});

const DocumentModel = mongoose.model('document', DocumentSchema)

//faceData
fakeData.forEach(el => {
    const {name, link, linkavt, source, subject, type} = el;
    const document = new DocumentModel({  
        name: name,     
        link: link,
        linkavt: linkavt,
        createTime: new Date(),    
        source: source,        
        subject: subject,
        type: type
    })    
    document.save()
});

//create document
app.post('/documents', (req, res) => {
    const {name, link, linkavt, source, categories} = req.body();  
    const document = new DocumentModel({  
        name: name,     
        link: link,
        linkavt: linkavt,
        createTime: new Date(),    
        source: source,
        categories: categories
    })   
    document.save().then(() => {
        res.send("Imported!")
    })
})

//getAll document
// app.get('/documents', (req, res) => {
    // DocumentModel.find((err, data) => {
    //     if(err) {
    //         console.log(err);
    //         res.send("Something went wrong!")
    //     }

    //     res.json(data)
    // })
// })

//filter data
app.get('/documents', function(req, res){
    // var posts
    var {subject, type} = req.query;
      
    DocumentModel.find((err, data) => {
        if(err) {
            console.log(err);
            res.send("Something went wrong!")
        }
        else{ 
            if(subject != null && subject != "")  {
                data = data.filter((item)=>{    
                    return item.subject == subject && item.type == type
                    });
            }     
            if(type != null && type != "")   {
                data = data.filter((item)=>{    
                    return item.type == type && item.type == type
            });
            }     
            res.send(data)        
        }        
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