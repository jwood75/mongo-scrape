var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request");

//navigating to our models
var Note = require("./models/note.js");
var Article = require("./models/article.js");

mongoose.Promise = Promise;

var app = express();

app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(express.static("public"));

mongoose.connect("mongodb://heroku_1pmzn21r:8kmg2gcdirr0b0gdutkr9c7v7p@ds139362.mlab.com:39362/heroku_1pmzn21r");

var db = mongoose.connection;

db.on("error", function(error){
	console.log("Mongoose Error: " + error);
});

db.once("open", function(){
	console.log("Mongoose Connection Successful");
})

//creating mongoose route

//route to scrape articles and save to database
app.get("/scrape", function(req, res){

	request("https://www.nytimes.com/", function(error, response, html) {
		var $ = cheerio.load(html);

		$("h2.story-heading").each(function(i, element){
			var result = {};

			result.title = $(this).children("a").text();
			result.link = $(this).children("a").attr("href");

			var entry = new Article(result);

			entry.save(function(err, doc){
				if (err){
					console.log(err);
				}
				else{
					console.log(doc);
				}
			});
		});
	});
	res.send("Scrape Complete");
});

//route to retrieve articles from databse
app.get("/articles", function(req, res){

	Article.find({}, function(error, doc){

		if(error){
			console.log(error);
		}
		else{
			res.send(doc);
		}
	});
});

//route to retrieve articles by ID and associated notes
app.get("/articles/:id", function(req, res){

	Article.findOne({"_id": req.params.id})
	.populate("note")
	.exec(function(error, doc){

		if(error){
			console.log(error);
		}
		else{
			res.json(doc);
		}
	});
});

//route to create new note, add to database, and associate with article 
app.post("/articles/:id", function(req, res){

	var newNote = new Note(req.body);

	newNote.save(function(error, doc){

		if(error){
			console.log(error);
		}
		else{
			res.send(doc);
		}
	});
});

//loading index.html
app.get("/", function(req, res){
	res.sendFile(path.join(__dirname + "public/index.html"));
});

app.listen(8080, function(){
	console.log("Running On Port 3000");
});