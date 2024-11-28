import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importa useNavigate
import PostComponent from '../components/forum/Post';
import { fetchPostById, fetchAllCommentsByPost, createComment, createReply, votePost } from '../services/forumService';

export default function PostPage() {
  const { postId } = useParams(); // Extrae el postId de los parámetros de la URL
  const navigate = useNavigate(); // Usa useNavigate para la navegación
  console.log('Post ID in PostPage component:', postId); // Log para verificar el valor del postId

  const [selectedPost, setSelectedPost] = useState(null);

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
      }
    };

    getPostDetails();
  }, [postId]);

  const addComment = async (content) => {
    try {
      const newComment = await createComment(postId, content);
      setSelectedPost((prev) => ({
        ...prev,
        comments: [...prev.comments, newComment],
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const addReply = async (commentId, content) => {
    try {
      const newReply = await createReply(postId, commentId, content);
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
    }
  };

  const handleBack = () => {
    navigate('/forum'); // Navega de regreso a la página del foro
  };

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
        onAddComment={addComment}
        onVotePost={handleVotePost}
        onVoteComment={(commentId, direction) => handleVotePost(commentId, direction)}
        onAddReply={addReply}
      />
    </main>
  );
}
