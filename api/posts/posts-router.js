// implement your posts router here
const express = require("express");
const Posts = require("./posts-model");

const router = express.Router();

//ENDPOINTS

router.get("/", (req, res) => {
  Posts.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "The posts information could not be retrieved",
        err: err.message,
        stack: err.stack,
      });
    });
});

router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ message: "The post information could not be retrieved" });
    });
});

router.post("/", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    Posts.insert(req.body)
      .then(({ id }) => {
        return Posts.findById(id);
      })
      .then((post) => {
        console.log(post);
        res.status(201).json(post);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          message: "There was an error while saving the post to the database",
        });
      });
  }
});

router.put("/:id", (req, res) => {
  const changes = req.body;
  const id = req.params.id;
  if (!changes.title || !changes.contents) {
    return res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  }
  Posts.update(id, changes)
    .then((isSuccess) => {
      if (!isSuccess) {
        return res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      }
      Posts.findById(req.params.id).then((post) => {
        res.status(200).send(post);
      });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "The post information could not be modified" });
    });
});

router.delete("/:id", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    console.log(post);
    if (!post) {
      return res.status(404).json({
        message: "The post with the specified ID does not exist",
      });
    }
    const deletedPost = await Posts.remove(req.params.id);
    console.log(`DELETED POST: ${deletedPost}`);
    return res.status(200).json(post);
  } catch (err) {
    res.status(500).json({
      message: "The post could not be removed",
      err: err.message,
      stack: err.stack,
    });
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) {
      res.status(404).json({
        message: "The post with the specified ID does not exist",
      });
    } else {
      const comment = await Posts.findPostComments(req.params.id);
      console.log(comment);
      res.json(comment);
    }
  } catch (err) {
    res.status(500).json({
      message: "The comments information could not be retrieved",
      err: err.message,
      stack: err.stack,
    });
  }
});
module.exports = router;
