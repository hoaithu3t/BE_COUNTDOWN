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

const TestDateSchema = mongoose.Schema({
    id: String,
    name: String,
    date: Date
});

const DocumentModel = mongoose.model('document', DocumentSchema)
const TestDateModel = mongoose.model('testDate', TestDateSchema)


const fakeDate = [
    {
        name: "JLPT - Kì thi năng lực tiếng Nhật",
        date: new Date(2021, 4, 7)
    },
    {
        name: "Kì thi THPTQG - 2021",
        date: new Date(2021, 21, 7)
    }
]
//fakeData
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

fakeDate.forEach(el => {
    const testDate = new TestDateModel({
        name: el.name,
        date: el.date
    })
    testDate.save();
})

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
    var {subject, type, take} = req.query;
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
            var result = [];
            for(var i = 0 ; i < take; i++ ){
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
app.put('/documents/:id', (req, res) => {
    const id = req.params.id;    
    DocumentModel.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
      }).then(() => {
          res.send("updated")
      });

})


//delete document
app.delete("/documents/:id", (req, res) => {
    DocumentModel.deleteOne({_id: req.params.id}).then(() => {
        res.send("Deleted!")
    })
})


//create date
app.post('/dates', (req, res) => {
    const {name, date} = req.body;     
    const document = new TestDateModel({  
        name: name,     
        date: date
    })   
    document.save().then(() => {
        res.send("Imported!")
    })
})


//getdate
app.get('/dates', function(req, res){    
    TestDateModel.find((err, data) => {
        if(err) {
            console.log(err);
            res.send("Something went wrong!")
        }
        else{
            data.forEach(el => {
                el.id = el._id
            })
            res.send(data)        
        }        
    })

 
})

//update dates
app.put('/dates/:id', (req, res) => {
    const id = req.params.id;    
    TestDateModel.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
      }).then(() => {
          res.send("updated")
      });

})


//delete dates
app.delete("/dates/:id", (req, res) => {
    TestDateModel.deleteOne({_id: req.params.id}).then(() => {
        res.send("Deleted!")
    })
})


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))