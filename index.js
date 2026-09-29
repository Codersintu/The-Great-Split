import express from 'express';
import jwt from "jsonwebtoken";
import authMiddleware, { loggerMiddleware } from './middleware.js';
const app = express();

app.use(express.json());
app.use(loggerMiddleware);

let users=[];
let blogPosts = [];

app.get('/', (req, res) => {
  res.send('Welcome to the Express server!');
});


// Login route
app.post("/login",(req,res)=>{
  const {username,password}=req.body;
  const ExistingUser=users.find(u=>u.username === username && u.password === password);
  let id=users.length + 1;
  if(ExistingUser){
    const jwtToken=jwt.sign({id:ExistingUser.id},'secretkey',{expiresIn:'1h'});
    return res.send({message:'Login successful!',token:jwtToken});
  }else{
    users.push({id,username,password});
    const jwtToken=jwt.sign({id},'secretkey',{expiresIn:'1h'});
    return res.send({message:'User created successfully!',token:jwtToken});
  }
})


// Blog posts routes
app.get('/posts', (req, res) => {
    res.send(blogPosts);
});


// Create a new post
app.post('/posts', authMiddleware, (req, res) => {

  const authorId = req.id;

  const { title, content } = req.body;

  const id = blogPosts.length + 1;

  const newPost = {
    id,
    authorId,
    title,
    content
  };

  blogPosts.push(newPost);

  res.status(201).send({
    message: 'Post submitted successfully!',
    post: newPost
  });
});


// Get a specific post by ID
app.get('/posts/:id', authMiddleware, (req, res) => {

  const postId = parseInt(req.params.id);

  const post = blogPosts.find(
    p => p.id === postId
  );

  if (!post) {
    return res.status(404).send({
      message: 'Post not found'
    });
  }

  return res.send(post);
});



// Update a specific post by ID
app.put('/posts/:id', authMiddleware, (req, res) => {

  const postId = parseInt(req.params.id);

  const postExists = blogPosts.some(
    p => p.id === postId
  );

  if (!postExists) {
    return res.status(404).send({
      message: 'Post not found'
    });
  }

  blogPosts = blogPosts.map(post => {

    if (post.id === postId) {
      return {
        ...post,
        ...req.body
      };
    }

    return post;
  });

  const updatedPost = blogPosts.find(
    post => post.id === postId
  );

  res.send({
    message: 'Post updated successfully!',
    post: updatedPost
  });
});



// Delete a specific post by ID
app.delete('/posts/:id', authMiddleware, (req, res) => {

  const postId = parseInt(req.params.id);

  const postExists = blogPosts.some(
    post => post.id === postId
  );

  if (!postExists) {
    return res.status(404).send({
      message: 'Post not found'
    });
  }

  blogPosts = blogPosts.filter(
    post => post.id !== postId
  );

  res.send({
    message: 'Post deleted successfully!'
  });
});


app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});