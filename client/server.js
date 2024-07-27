const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3001; 
const postsFilePath = path.join(__dirname, 'posts.json');
const commentsFilePath = path.join(__dirname, 'comments.json');
const profileFilePath = path.join(__dirname, 'profile.json');

app.use(bodyParser.json());

const readJSONFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
};

const writeJSONFile = (filePath, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};


app.get('/profile', async (req, res) => {
  try {
    const profile = await readJSONFile(profileFilePath);
    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch profile data' });
  }
});


app.post('/posts', async (req, res) => {
  try {
    const posts = await readJSONFile(postsFilePath);
    const newPost = { id: Date.now(), ...req.body };
    posts.push(newPost);
    await writeJSONFile(postsFilePath, posts);
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ error: 'Unable to create post' });
  }
});

app.get('/posts', async (req, res) => {
  try {
    const posts = await readJSONFile(postsFilePath);
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch posts' });
  }
});

app.get('/posts/:id', async (req, res) => {
  try {
    const posts = await readJSONFile(postsFilePath);
    const post = posts.find(p => p.id == req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch post' });
  }
});

app.delete('/posts/:id', async (req, res) => {
  try {
    let posts = await readJSONFile(postsFilePath);
    posts = posts.filter(p => p.id != req.params.id);
    await writeJSONFile(postsFilePath, posts);
    res.status(200).json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Unable to delete post' });
  }
});


app.post('/comments', async (req, res) => {
  try {
    const comments = await readJSONFile(commentsFilePath);
    const newComment = { id: Date.now(), ...req.body };
    comments.push(newComment);
    await writeJSONFile(commentsFilePath, comments);
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ error: 'Unable to create comment' });
  }
});

app.get('/comments', async (req, res) => {
  try {
    const comments = await readJSONFile(commentsFilePath);
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch comments' });
  }
});

app.get('/posts/:id/comments', async (req, res) => {
  try {
    const comments = await readJSONFile(commentsFilePath);
    const postComments = comments.filter(c => c.postId == req.params.id);
    res.status(200).json(postComments);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch comments' });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
