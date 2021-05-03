var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
let Todo = require('./todo.model');
/* GET home page. */


mongoose.connect('mongodb+srv://khanhthien:khanhthien1998@cluster0.kgonr.mongodb.net/demo', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

router.route('/').get(function(req, res) {
    Todo.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

router.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Todo.findById(id, function(err, todo) {
        res.json(todo);
    });
});

router.route('/update/:id').post(function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            todo.save().then(todo => {
                res.json('Todo updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

router.route('/add').post(function(req, res) {
    let todo = new Todo(req.body);
    console.log(todo);
    
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});
router.route('/delete/:id').delete(function(req,res){
        console.log(req.params.id);
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is delete");
        else
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            todo.remove().then(todo => {
                res.json('Todo Delete!');
            })
            .catch(err => {
                res.status(400).send("Delete not possible");
            });
    });

})


module.exports = router;