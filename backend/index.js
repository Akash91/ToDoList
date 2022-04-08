const express = require('express');
const { v4: uuidv4 } = require('uuid');
// const { url } = require('inspector');
const { MongoClient, ServerApiVersion } = require('mongodb');
const path = require('path');
const port = 8000;

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// app.use(express.urlencoded());
app.use(express.static('assets'));


const uri = "mongodb+srv://root:toor@cluster0.iafal.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect(err => {
    if (err) {
        console.log('Unable to connect to Mongo.');
        process.exit(1);
    } else {
        console.log('connected to db 3000...');
    }
});
const tasksCollection = client.db('test').collection('tasks');

// const tasksCollection = db.collection('tasks');

app.post('/create-task', function(req, res){
    // toDoList.push({
    //     task: req.body.task,
    //     date: req.body.date,
    //     option: req.body.option
    // });
    const id = uuidv4();
    req.body = {
        ...req.body,
        taskId: id
    };
    tasksCollection.insertOne(req.body).then(result => {
        console.log(result);
    }).catch(error => console.error(error))
      
    // toDoList.push(req.body);
    return res.redirect('/');
    // return res.redirect('back');
  });

var toDoList = [
    // {
    //     task: "Hiking",
    //     date: "13/04/2022",
    //     option: "Personal",
    // },
    // {
    //     task: "Biking",
    //     date: "13/04/2022",
    //     option: "Personal",
    // }
]

app.get('/', function(req, res){
    tasksCollection.find().toArray()
        .then(results => {
        console.log(results);
        return res.render('home', {
            title: "My To-Do List",
            todo_List: results
        });
    })
    .catch(error => console.error(error))
})

// app.get('/delete-task/', function(req, res){
//     console.log(req.query);
    
    
// })
var complete = ["finish jquery"]

app.post('/removetask', function(req, res){
    console.log(req.body);
    var deleteTask = req.body.checkbox;
    if(deleteTask === "on") {
        toDoList = [];
    }
    // let taskIndex = toDoList.findIndex(task => task.deleteTask == deleteTask);
    // if(taskIndex != -1){
    //     toDoList.splice(taskIndex, 1);
    // }
    return res.redirect('back');
})

// app.get('/delete-btn/', function(req, res){
//     let date = req.query.date;
//     let taskIndex = toDoList.findIndex(task => task.date == date);
    
//     if(taskIndex != -1){
//         toDoList.splice(taskIndex, 1);
//     }

//     return res.redirect('back');
// })

app.listen(port, function(err){
    if(err){
        console.log('Error in running the server', err);
    }
    console.log('Express Server is running successfully on Port:', port);
})