const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");      //body parser for parsing strings entered by user
const ejs = require("ejs");

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://admin:madhav123456@entries.g7rqhn7.mongodb.net/")
.then(() => {
    console.log("Database is connected");
}).catch((error) => {
    console.log(error);
})

const userSchema = {
    date: String,
    title: String,
    content: String
}

const info = mongoose.model("Information", userSchema);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/homepage.html"));
});

app.get("/entries", (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"));
});

app.post("/entries", (req, res) => {
    const newInfo = new info({
        date: req.body.date,
        title: req.body.title,
        content: req.body.content
    })
    newInfo.save();
    res.redirect("/");
})

app.get("/display", (req, res) => {
    res.sendFile(path.join(__dirname + "/display.html"))
})

app.get("/display/:title", (req, res) => {
    const t = req.params.title;
    info.findById({_id: t}).then((err, entry) => {
        if (err) {
            res.json(err);
        }
        else {
            res.render('output', {
                title: entry.title,
                content: entry.content
            })
        }
    })
})

app.get("/all_entries", (req, res) => {
    info.find().then((err, allInfo) => {
        if (err) {
            res.json(err);
        }
        else {
            res.render('all', {
                users: allInfo
            });
        }
    });
});

app.listen(2501, () => {
    console.log("Server is on");
});