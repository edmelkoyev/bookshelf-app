var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static(__dirname));
app.use(bodyParser.json());

var id = 0;
var books = {};

books[++id] = {_id:id, author:"Charles Dickens", title:"Oliver Twist"};

app.get("/books", function(req, res){
    res.json(Object.keys(books).map(function(id){
        return books[id];
    }));
});

app.get("/books/:id", function(req, res){
    var curId = parseInt(req.params.id, 10);
    console.log("/books: GET, book " + curId);
    res.json(books[curId]);
});

app.post("/books", function(req, res){
    var curId = ++id;
    console.log("/books: POST, book " + curId);

    var book = req.body;
    book._id = curId;
    books[curId] = book;
    res.json(books[curId]);
});

app.put("/books/:id", function(req, res){
    var curId = parseInt(req.params.id, 10);
    console.log("/books: PUT, book " + curId);

    books[curId] = req.body;
    res.json(books[curId]);
});

app.delete("/books/:id", function(req, res){
    var curId = parseInt(req.params.id, 10);
    console.log("/books: DELETE, book " + curId);
    delete books[curId];
    res.json(null);
});

app.get("*", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.listen(3000);
console.log("Ready: Listening to port: 3000");