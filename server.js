const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");      //body parser for parsing strings entered by user
const ejs = require('ejs');

const app = express();

app.use(express.json());
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

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

const Information = mongoose.model("Information", userSchema);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/homepage.html"));
});

app.get("/entries", (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"));
});

app.post("/entries", (req, res) => {
    const newInfo = new Information({
        date: req.body.date,
        title: req.body.title,
        content: req.body.content
    })
    newInfo.save();
    res.redirect("/");
})

app.get("/display", (req, res) => {
    res.sendFile(path.join(__dirname + "/display.html"));
})

app.post("/results", (req, res) => {
    const t = req.body.title;
    Information.findOne({title: t}).then(entry => {
        res.render('output', {
            title: entry.title,
            content: entry.content
        });
    }).catch((err) => {
        res.send("Entry not found. Please try again.");
    })
})

app.get('/all', (req, res) => {
    Information.find({}).then(allInfo => {
        res.render('all', {
            users: allInfo
        })
    }).catch((err) => {
        res.send("Your diary is empty at the moment. Please make an entry in order to view.");
    });
});

app.get("/update", (req, res) => {
    res.sendFile(path.join(__dirname + "/update.html"));
})

app.post("/entryupdated", (req, res) => {
    const t = req.body.title;
    const up = req.body.content;
    Information.findOneAndUpdate({title: t}, {content: up}, {new: true}).then(() => {
        res.render('updated');
    }).catch((err) => {
        res.send("Entry not found/already updated. Please try again.");
    })
})

app.get("/deleteOne", (req, res) => {
    res.sendFile(path.join(__dirname + "/deleteSp.html"));
})

app.post("/entrydeleted", (req, res) => {
    const t = req.body.title;
    Information.findOneAndDelete({title: t}).then(entry => {
        res.render('deleteOne');
    }).catch((err) => {
        res.send("Entry not found/already deleted. Please try again.");
    })
})

app.get('/deleted', (req, res) => {
    Information.deleteMany({}).then((err, result) => {
        res.render('deleted');
    });
});

app.listen(2501, () => {
    console.log("Server is on");
});
