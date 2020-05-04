const express = require("express");
const axios = require("axios");
 
const app = express();
const pages = __dirname + "/public/pages/";

function sendPage(response, path) {
    response.sendFile(pages + path);
}

app.use(express.static("public"));

app.get("/", function(request, response){
    response.sendFile(__dirname + "/public/index.html");
});
app.use("/pages", function(request, response) {
    sendPage(response, request.url);
});
app.get("/manga", function(request, response){
    sendPage(response, "manga.html");
});
app.get("/news", function(request, response){
    sendPage(response, "news.html");
});
app.get("/random", function(request, response){
    sendPage(response, "random.html");
});
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
            response.send(obj);
        }
        else
        {
            response.send("<h1>500 Internal Server Error</h1>");
        }
    }
});
app.use("/media/", async function(request, response) {
    response.redirect("https://remanga.org/media/" + request.url);
});
app.use(function(request, response, next) {
    response.status(404).sendFile(pages + "404.html"); 
});

app.listen(19532, function() {
    console.log('server started');
});