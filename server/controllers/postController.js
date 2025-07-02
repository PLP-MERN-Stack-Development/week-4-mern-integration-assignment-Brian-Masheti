const Post = require('../models/Post');

// Get all posts with pagination, search, and filter
exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';

    // Build filter
    let filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) {
      filter.category = category;
    }

    const [posts, total] = await Promise.all([
      Post.find(filter).sort({ createdAt: -1 }).populate('category').skip(skip).limit(limit),
      Post.countDocuments(filter)
    ]);

    res.json({
      posts,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('category');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, content, category, featuredImage } = req.body;
    const post = new Post({ title, content, category, featuredImage });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create post' });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const { title, content, category, featuredImage } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, category, featuredImage, updatedAt: Date.now() },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update post' });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) return res.status(400).json({ error: 'User ID required' });
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.likedBy.includes(userId)) {
      return res.status(400).json({ error: 'User already liked this post' });
    }
    post.likedBy.push(userId);
    post.likeCount = post.likedBy.length;
    await post.save();
    res.json({ likeCount: post.likeCount, likedBy: post.likedBy });
  } catch (err) {
    res.status(500).json({ error: 'Failed to like post' });
  }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) return res.status(400).json({ error: 'User ID required' });
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (!post.likedBy.includes(userId)) {
      return res.status(400).json({ error: 'User has not liked this post' });
    }
    post.likedBy = post.likedBy.filter(id => id !== userId);
    post.likeCount = post.likedBy.length;
    await post.save();
    res.json({ likeCount: post.likeCount, likedBy: post.likedBy });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unlike post' });
  }
};
