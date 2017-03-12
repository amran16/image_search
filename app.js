var express = require('express');
var mongoose = require('mongoose');
var request = require('request');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

mongoose.connect('mongodb://localhost/image_search');

//Set static path
app.use(express.static(__dirname + '/public'));

//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({extended : true}));

var searchKey = 'AIzaSyBnrMdXiv60nRizpElDb3QECo8QSscnSqg';
//var engineID =  '000754867127125657108:bxeoqm_9f20';
//var engineID =  '000754867127125657108';
var engineID = "008924517014194673499%3Atkjerk2whko"; //borrowed this
//var engineID = "000754867127125657108%3Ayju24uvruqq";
//var engineID = "000754867127125657108%yju24uvruqq";

var querySchema = new mongoose.Schema({
    termsearch: String,
    when: String
});

var Query = mongoose.model('Query', querySchema);

app.get('/', function(req, res){
    res.render('index');
});

app.get('/:searchable', function(req, res){


    var searchTerm = req.params.searchable;
    //console.log(searchTerm)

    Query.create({
      termsearch: searchTerm,
        when: new Date()
    })

    //var url = 'https://www.googleapis.com/customsearch/v1'+'?key='+CSE_API_KEY +'&cx='+//+'&searchType=image&num=10'+'&q='+q;
    var searchUrl = 'https://www.googleapis.com/customsearch/v1?q='+searchTerm+'&key='+searchKey+'&cx='+engineID+'&searchType=image&num=10';

    request(searchUrl, function(error, response, body){
      var result = [];
        if (!error && response.statusCode == 200) {
          //res.send(body);
          var info = JSON.parse(body);
           //res.send(info.items)
          for(var i = 0; i < info.items.length; i++){
            var newObj = {
                        "title": info.items[i].title,
                        "snippet": info.items[i].snippet,
                        "imgUrl": info.items[i].link,
                        "contex link": info.items[i].image.contextLink
                };
              result.push(newObj);
          }
           res.send(result);
      }
  });
});

app.get('/:searchable/recent', function(req, res){
  //var previousSearch = req.params
  Query.find().sort({date: -1})
    .exec(function(err, data){
      if (err) throw console.error(err);
      else{
        res.json(data);
      }
    })

});

app.listen(4000, function(){
    console.log("Server running on port 4000");
});
