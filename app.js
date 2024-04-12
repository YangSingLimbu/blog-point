const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const path = require("path");

let posts = [];

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home", {
    postsContent: posts,
  });
});
app.get("/about", (req, res) => {
  res.render("about", {});
});

app.get("/contact", (req, res) => {
  res.render("contact", {});
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const Compose = {
    title: req.body.title,
    content: req.body.body,
  };
  const window = new JSDOM("").window;
  const DOMPurify = createDOMPurify(window);
  Compose.content = DOMPurify.sanitize(Compose.content);

  posts.push(Compose);
  res.redirect("/");
});

app.get("/posts/:title", (req, res) => {
  var urlTitle = _.lowerCase(req.params.title);

  posts.forEach((x) => {
    if (_.lowerCase(x.title) === urlTitle) {
      res.render("post.ejs", {
        postTitle: x.title,
        postBody: x.content,
      });
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
