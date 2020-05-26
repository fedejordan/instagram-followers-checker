const express = require('express')
const path = require('path')
var FormData = require('form-data');
const fetch = require('node-fetch');
const port = process.env.PORT || 3000
const app = express()

// serve static assets normally
// app.use(express.static(__dirname + '/public'))


async function getFollowers(code, apiResponse) {
	var formData = new FormData();

    formData.append("client_id", process.env.CLIENT_ID);
    formData.append("client_secret", process.env.CLIENT_SECRET);
    formData.append("grant_type", "authorization_code")
    formData.append("redirect_uri", "https://instagram-followers-checker.herokuapp.com/auth")
    formData.append("code", code);

    let response = await fetch('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        body: formData
    });
    let result = await response.text();
    let components1 = result.split('"access_token": "');
    let components2 = components1[1].split('", "user_id"');
    let accessToken = components2[0];
    let components3 = result.split('"user_id": ');
    let components4 = components3[1].split('}');
    let userId = components4[0];
    console.log('userId: ' + userId + " accessToken: " + accessToken)

    // Request followers
    let response2 = await fetch('https://graph.instagram.com/' + userId + '?fields=id,username&access_token=' + accessToken)
    let result2 = await response2.json();
    console.log(result);

    apiResponse.sendFile(path.resolve(__dirname, '', 'auth.html'))
}

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('/', function (request, response){
  response.sendFile(path.resolve(__dirname, '', 'index.html'))
})

app.get('/auth', function (request, response){
  const code = request.query.code;
  console.log('code: ' + code)
  getFollowers(code, response)
  
})

app.get('*', function (request, response){
  response.sendStatus(404);
})

app.listen(port)
console.log("server started on port " + port)