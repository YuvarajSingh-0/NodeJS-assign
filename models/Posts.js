const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    content : {
        type : String,
        required : true
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    likes : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        default : []
    }],
    parentId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Post',
        default : null
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
});

PostSchema.virtual('likeCount').get(function () {
    return this.likes.length;
});


module.exports = mongoose.model('Post', PostSchema);
