var express = require("express");
var app = express();

var request = require("request");
var env = require("./env.json");

app.set("port", process.env.PORT || 3000);

app.get("/", function(req, res){
  res.redirect("https://github.com/login/oauth/authorize?client_id=" + env.client_id);
});

app.get("/callback", function(req, res){
  var body = JSON.parse(JSON.stringify(env));
  body["code"] = req.query.code;
  request({
    method: "POST",
    uri: "https://github.com/login/oauth/access_token",
    json: true,
    body: body
  }, function(err, response){
    if(response.body.access_token){
      res.send(response.body.access_token);
    }else{
      res.send("Error!");
    }
  });
});

app.listen(app.get("port"), function(){
  console.log("Listening on " + app.get("port"));
});
