const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { json } = require('body-parser');
const fakeData = require("./fakeData")

const PORT = process.env.PORT || 5000;
const app = express();
const DBHOST = 'cluster0.s3j79.mongodb.net';
const DBPOST = "cluster0.s3j79.mongodb.net";
const DBNAME = "documents";

mongoose.connect("mongodb+srv://CountDown:18082000@cluster0.x0bvk.mongodb.net/countdown?retryWrites=true&w=majority",
    { useNewUrlParse: true, useUnifiedTopology: true},
    err => {
        if(!err){
            console.log("Conected to mongoDB")
        }
    })


app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const DocumentSchema = mongoose.Schema({
    id: String,
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
    const {name, link, linkavt, source, subject, type} = req.body;     
    const document = new DocumentModel({  
        name: name,     
        link: link,
        linkavt: linkavt,
        createTime: new Date(),    
        source: source,
        subject: subject,
        type: type
    })   
    document.save().then(() => {
        res.send("Imported!")
    })
})


//filter data
app.get('/documents', function(req, res){
    // var posts
    var {subject, type, page} = req.query;
    if(page == null) page = 1;   
    var prePage =  (page-1)*10;
    DocumentModel.find((err, data) => {
        if(err) {
            console.log(err);
            res.send("Something went wrong!")
        }
        else{ 
            if(subject != null && subject != "")  {
                data = data.filter((item)=>{    
                    return item.subject == subject 
                    });
            }     
            if(type != null && type != "")   {
                data = data.filter((item)=>{    
                    return item.type == type
            });
            }
            var endPage = (data.length - prePage > 10) ? (prePage + 10) : (data.length)
            var result = [];
            for(var i = prePage ; i < endPage; i++ ){
                 result.push(data[i]);
            }   
            result.forEach(el => {
                el.id = el._id;
            })
            res.send(result)        
        }        
    })

 
})

//update document
app.put('/documents', (req, res) => {
    const id = req.params.id;    
    DocumentModel.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
      }).then(() => {
          res.send("updated")
      });

})


//delete document
app.delete("/documents/:id", (req, res) => {
    console.log(req.params.id)
    DocumentModel.deleteOne({_id: req.params.id}).then(() => {
        res.send("Deleted!")
    })
})


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))