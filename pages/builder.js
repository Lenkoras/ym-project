const express = require("express");
const axios = require("axios");
const fs = require('fs')
 
const app = express();

const dir = __dirname + "/public/";

function sendPage(response, path) {
    path = dir + path + ".html";
    fs.exists(path, function(exists) {
        if (exists) {
            fs.readFile(path, "utf8", function(error, data)
            { 
                response.send(data);
            });
        }
        else {
            response.status(404).sendFile(dir + 'pages/404.html');
        }
    });
}

app.use(express.static("public"));

app.use("/api/", async function(request, response) {
    try {
        let json = await axios.get('https://api.remanga.org/api/' + request.url);
        response.json(json.data);
    }
    catch (ex) {
        const { statusCode } = ex.request.res;
        if (statusCode == 404) {
            let obj = { msg: "Content not found",
                        statusCode: 404
                    };
            response.status(404).send(obj);
        }
        else
        {
            response.status(statusCode).send("<h1>500 Internal Server Error</h1>");
        }
    }
});
app.use("/media/", function(request, response) {
    response.redirect("https://remanga.org/media/" + request.url);
});
app.use("/content/", function(request, response) {
    if (request.url === '/') {
        sendPage(response, 'pages/catalog');
    }
    else {
        sendPage(response, "pages/" + request.url);
    }
});
app.use('/title/:name', function(request, response) {
    response.redirect('/api/search/?query=' + request.params.name + "&count=1");
});
app.use(function(request, response) {
    sendPage(response, 'index');
});
app.listen(19532, function() {
    console.log('server started');
});
