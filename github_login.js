var express = require("express");
var app = express();

var request = require("request");
var env = require("./env.json");

app.set("port", process.env.PORT || 3000);

app.get("/", function(req, res){
  var url = "https://github.com/login/oauth/authorize?" + [
    "client_id=" + env.client_id,
    "state=" + encodeURIComponent(req.query.redirect_to)
  ].join("&");
  if(!req.query.redirect_to) res.send("Error! No `redirect_to` parameter provided. I need to know where to send you once you've logged in!");
  else res.redirect(url);
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
    var redirect_to = req.query.state;
    var token = response.body.access_token;
    var qOrAmp = (/\?/.test(redirect_to) ? "&" : "?");
    if(token && redirect_to){
      res.redirect(redirect_to + qOrAmp + "token=" + token);
    }else res.send("Something went wrong. :( Try again later, maybe!");
  });
});

app.listen(app.get("port"), function(){
  console.log("Listening on " + app.get("port"));
});
