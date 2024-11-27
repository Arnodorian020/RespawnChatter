import React, { useState } from 'react';
import CommentCard from './CommentCard';
import { ArrowBigDown, ArrowBigUp, MessageSquare, Pencil } from 'lucide-react';

export default function PostComponent({ post, onAddComment, onVotePost, onVoteComment, onAddReply, onUpdatePost, onUpdateComment, onUpdateReply }) {
  const [commentContent, setCommentContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editPost, setEditPost] = useState({ title: post.title, content: post.content, tags: post.tags.join(', ') });

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (commentContent.trim()) {
      onAddComment(commentContent);
      setCommentContent('');
    }
  };

  const handleUpdatePost = (e) => {
    e.preventDefault();
    onUpdatePost({
      ...post,
      title: editPost.title.trim(),
      content: editPost.content.trim(),
      tags: editPost.tags.split(',').map(tag => tag.trim())
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {isEditing ? (
          <form onSubmit={handleUpdatePost}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Title</label>
              <input
                type="text"
                value={editPost.title}
                onChange={(e) => setEditPost({ ...editPost, title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Content</label>
              <textarea
                value={editPost.content}
                onChange={(e) => setEditPost({ ...editPost, content: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows={5}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Tags</label>
              <input
                type="text"
                value={editPost.tags}
                onChange={(e) => setEditPost({ ...editPost, tags: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Update Post
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h1>
              <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-blue-500 transition-colors">
                <Pencil size={24} />
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <span>Posted by {post.author}</span>
              <span>•</span>
              <span>{post.timestamp}</span>
            </div>
            <p className="text-gray-800 text-lg mb-4">{post.content}</p>
            <div className="flex items-center gap-2 text-gray-500">
              <MessageSquare size={20} />
              <span>{post.comments.length} comments</span>
            </div>
          </>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Add a Comment</h2>
        <form onSubmit={handleSubmitComment}>
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="What are your thoughts?"
            rows={4}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Comment
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {post.comments.map((comment) => (
          <CommentCard
            key={comment._id}
            comment={comment}
            onAddReply={(replyContent) => onAddReply(post._id, comment._id, replyContent)}
            onVote={(direction) => onVoteComment(post._id, comment._id, direction)}
            onUpdateComment={(commentId, newContent) => onUpdateComment(commentId, newContent)}
            onUpdateReply={(replyId, newContent) => onUpdateReply(replyId, newContent)}
          />
        ))}
      </div>
    </div>
  );
}
