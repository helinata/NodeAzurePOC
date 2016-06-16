var http = require('http');
var express = require('express');
var app = express();

app
    .use(express.static('public'))
    .get('/home/login', function (req, res) {
    console.log('Login request');
    res.status(200).send('Login from server.');
})
    .all('/*', function (req, res) {
        console.log('All');
        res
            .status(200)
            .set({ 'content-type': 'text/html; charset=utf-8' })
            .sendFile('/public/index.html', { root: __dirname });
})
    .on('error', function (error) {
    console.log("Error: \n" + error.message);
    console.log(error.stack);
});

http
    .createServer(app).listen(1337)
    .on('error', function (error) {
    console.log("Error: \n" + error.message);
    console.log(error.stack);
});

console.log('Serving app on port 1337');