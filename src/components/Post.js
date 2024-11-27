import React from 'react';
import CommentCard from './CommentCard';
import { ArrowBigDown, ArrowBigUp, MessageSquare } from 'lucide-react';

export default function Post({ post, onAddComment, onVotePost, onVoteComment, onAddReply }) {
  const [commentContent, setCommentContent] = React.useState('');

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (commentContent.trim()) {
      onAddComment(commentContent);
      setCommentContent('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => onVotePost('up')}
              className="text-gray-500 hover:text-orange-500 transition-colors"
            >
              <ArrowBigUp size={24} />
            </button>
            <span className="font-medium text-lg">{post.votes}</span>
            <button
              onClick={() => onVotePost('down')}
              className="text-gray-500 hover:text-blue-500 transition-colors"
            >
              <ArrowBigDown size={24} />
            </button>
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h1>
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
          </div>
        </div>
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
          />
        ))}
      </div>
    </div>
  );
}
