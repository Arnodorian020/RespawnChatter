import React, { useState } from 'react';
import { ArrowBigDown, ArrowBigUp, MessageSquare, X, ChevronDown, ChevronUp } from 'lucide-react';
import EditableContent from './EditableContent';

export default function CommentCard({ comment, onAddReply, onVote, onUpdateComment, onUpdateReply }) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showReplies, setShowReplies] = useState(true);
  const [editingReplyId, setEditingReplyId] = useState(null);

  const handleSubmitReply = (e) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onAddReply(replyContent);
      setReplyContent('');
      setIsReplying(false);
      setShowReplies(true);
    }
  };

  const handleSaveComment = (newContent) => {
    onUpdateComment(comment._id, newContent);
  };

  const handleSaveReply = (replyId, newContent) => {
    onUpdateReply(replyId, newContent);
    setEditingReplyId(null);
  };

  const replies = comment.replies || [];

  const formatDate = (date) => {
    if (date && date.$date && date.$date.$numberLong) {
      return new Date(parseInt(date.$date.$numberLong)).toLocaleString();
    }
    return '';
  };

  const getNumberInt = (value) => {
    return value && value.$numberInt ? parseInt(value.$numberInt) : 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-2">
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => onVote('up')}
              className="text-gray-500 hover:text-orange-500 transition-colors"
            >
              <ArrowBigUp size={20} />
            </button>
            <span className="font-medium text-sm">{getNumberInt(comment.votes)}</span>
            <button
              onClick={() => onVote('down')}
              className="text-gray-500 hover:text-blue-500 transition-colors"
            >
              <ArrowBigDown size={20} />
            </button>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-sm text-gray-900">{comment.author}</span>
              <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
            </div>
            <EditableContent content={comment.content} onSave={handleSaveComment} />

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsReplying(!isReplying)}
                className={`flex items-center gap-1 text-sm ${isReplying ? 'text-blue-500 hover:text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {isReplying ? (
                  <>
                    <X size={16} />
                    Cancel reply
                  </>
                ) : (
                  <>
                    <MessageSquare size={16} />
                    Reply
                  </>
                )}
              </button>

              {replies.length > 0 && (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  {showReplies ? (
                    <>
                      <ChevronUp size={16} />
                      Hide replies
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} />
                      Show {replies.length} replies
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isReplying && (
        <div className="border-t border-gray-100 bg-gray-50 p-4">
          <form onSubmit={handleSubmitReply}>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              placeholder="Write your reply..."
              rows={3}
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => {
                  setIsReplying(false);
                  setReplyContent('');
                }}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!replyContent.trim()}
              >
                Reply
              </button>
            </div>
          </form>
        </div>
      )}

      {replies.length > 0 && showReplies && (
        <div className="border-t border-gray-100">
          {replies.map((reply, index) => (
            <div
              key={reply._id.$oid}
              className={`pl-8 pr-4 py-4 ${index !== replies.length - 1 ? 'border-b border-gray-100' : ''} bg-gray-50`}
            >
              <div className="flex items-start gap-2">
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => onVote(reply._id.$oid, 'up')}
                    className="text-gray-500 hover:text-orange-500 transition-colors"
                  >
                    <ArrowBigUp size={16} />
                  </button>
                  <span className="font-medium text-xs">{getNumberInt(reply.votes)}</span>
                  <button
                    onClick={() => onVote(reply._id.$oid, 'down')}
                    className="text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    <ArrowBigDown size={16} />
                  </button>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-gray-900">{reply.author}</span>
                    <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                  </div>
                  <EditableContent
                    content={reply.content}
                    onSave={(newContent) => handleSaveReply(reply._id.$oid, newContent)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
