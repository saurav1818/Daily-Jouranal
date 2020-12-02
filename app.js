const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogpostDB", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const Post = mongoose.model("Post", postSchema);

// const post1 = new Post({
//   title: "Day 1",
//   content: "This is my first Post",
// });

// const post2 = new Post({
//   title: "Day 2",
//   content: "This is my second post",
// });

// const post3 = new Post({
//   title: "Day 3",
//   content: "This is my third post",
// });

// const defaultPosts = [post1, post2, post3];

app.get("/", (req, res) => {
  Post.find({}, (err, foundPosts) => {
    if (!err) {
      res.render("home", { content: homeStartingContent, blogs: foundPosts });
    } else {
      res.send(err);
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about", { content: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { content: contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.get("/posts/:postName", (req, res) => {
  const id = req.params.postName;
  Post.findOne({ _id: id }, (err, post) => {
    if (!err) {
      res.render("post", {
        title: post.title,
        content: post.content,
        id: id,
      });
    }
  });
});

app.get("/edit/:postId", (req, res) => {
  const id = req.params.postId;
  Post.findOne({ _id: id }, (err, post) => {
    if (!err) {
      res.render("edit", {
        titlePlaceholder: post.title,
        contentPlaceholder: post.content,
        postId: id,
      });
    }
  });
});

app.post("/compose", (req, res) => {
  // const title = req.body.postTitle;
  // const content = req.body.postContent;
  const newPost = new Post({
    title: req.body.postTitle,
    content: req.body.postContent,
  });
  newPost.save();
  res.redirect("/");
});

app.post("/edit", (req, res) => {
  const id = req.body.id;
  Post.findByIdAndUpdate(
    id,
    { title: req.body.postTitle, content: req.body.postContent },
    (err, docs) => {
      if (!err) {
        res.redirect("/");
      } else {
        res.send(err);
      }
    }
  );
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
