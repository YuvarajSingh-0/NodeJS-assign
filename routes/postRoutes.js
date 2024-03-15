const express = require('express');
const auth = require('../middlewares/auth');
const Posts = require('../models/Posts');
const router = express.Router();

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const posts = await Posts.find({ parentId: null })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate({
            path: 'author',
            select: 'username'
        });
    res.send({ posts, likeCount: posts.likeCount });
});

router.post('/', auth, async (req, res) => {
    const { content } = req.body;
    const author = req.user._id;
    const post = new Posts({ content, author });
    await post.save();
    res.json(post.toObject());
});

router.put('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const post = await Posts.findOneAndUpdate(
        { _id: id, author: req.user._id },
        { content },
        { new: true }
    );
    if (!post) {
        return res.status(403).send({ message: 'You are not authorized to update this post' });
    }
    res.json(post);
});

router.post('/comment', auth, async (req, res) => {
    const { content, postId } = req.body;
    const author = req.user._id;
    const post = new Posts({ content, author, parentId: postId });
    await post.save();
    res.json(post);
});

router.post('/like', auth, async (req, res) => {
    const { postId } = req.body;
    const userId = req.user._id;
    const post = await Posts.findByIdAndUpdate(postId, { $addToSet: { likes: userId } }, { new: true });
    console.log(post);
    res.json({ ...post._doc, likeCount: post.likeCount });
});

router.post('/unlike', auth, async (req, res) => {
    const { postId } = req.body;
    const userId = req.user._id;
    const post = await Posts.findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true });
    res.json({ ...post._doc, likeCount: post.likeCount });
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const post = await Posts.findById(id).populate({
        path: 'author',
        select: 'username'
    });
    res.json(post);
});

router.get("/:id/comments", async (req, res) => {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const comments = await Posts.find({ parentId: id })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate({
            path: 'author',
            select: 'username'
        });
    res.json(comments);
});

router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const post = await Posts.findOneAndDelete({
        _id: id,
        author: req.user._id
    });

    if (!post) {
        return res.status(403).send({ message: 'You are not authorized to delete this post' });
    }
    res.send({ message: 'Post deleted successfully' });
});

module.exports = router;