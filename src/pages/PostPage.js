import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostComponent from '../components/forum/Post';
import { fetchPostById, fetchAllCommentsByPost, createReply, votePost, createComment } from '../services/forumService';
import { useAuth0 } from "@auth0/auth0-react";

export default function PostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth0();
  console.log('Post ID in PostPage component:', postId);

  const [selectedPost, setSelectedPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!postId) {
      console.error('Post ID is undefined or null', postId);
      return;
    }
    const getPostDetails = async () => {
      try {
        const post = await fetchPostById(postId);
        const comments = await fetchAllCommentsByPost(postId);
        setSelectedPost({ ...post, comments });
      } catch (error) {
        console.error('Error fetching post details:', error);
        setError(error.message);
      }
    };

    getPostDetails();
  }, [postId]);

  const addComment = async (content) => {
    try {
      if (!content.trim()) {
        setError('Comment cannot be empty');
        return;
      }

      const commentData = {
        author: user ? user.name : 'Anonymous',
        content: content.trim(),
      };

      const newCommentResponse = await createComment(postId, commentData);
      setSelectedPost((prev) => ({
        ...prev,
        comments: [...prev.comments, newCommentResponse],
      }));
      setError(null);
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Error adding comment');
    }
  };

  const addReply = async (commentId, content) => {
    try {
      const replyData = {
        author: user ? user.name : 'Anonymous',
        content: content.trim(),
      };

      const newReply = await createReply(postId, commentId, replyData);
      setSelectedPost((prev) => ({
        ...prev,
        comments: prev.comments.map((comment) =>
          comment._id === commentId
            ? { ...comment, replies: [...comment.replies, newReply] }
            : comment
        ),
      }));
    } catch (error) {
      console.error('Error adding reply:', error);
      setError('Error adding reply');
    }
  };

  const handleVotePost = async (direction) => {
    try {
      await votePost(postId, direction);
      setSelectedPost((prev) => ({
        ...prev,
        votes: prev.votes + (direction === 'up' ? 1 : -1),
      }));
    } catch (error) {
      console.error('Error voting post:', error);
      setError('Error voting post');
    }
  };

  const handleBack = () => {
    navigate('/forum');
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!selectedPost) {
    return <div>Loading...</div>;
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Details</h2>
        <button onClick={handleBack} className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900">
          ← Back to Posts
        </button>
      </div>
      <PostComponent
        post={selectedPost}
        user={user}
        setPost={setSelectedPost}
        fetchPostDetails={fetchPostById}
        onAddComment={addComment}
      />
    </main>
  );
}
