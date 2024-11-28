import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import PostsList from '../components/forum/PostsList';
import CreatePost from '../components/forum/CreatePost';
import { fetchPosts, createPost } from '../services/forumService';
import { useNavigate } from 'react-router-dom';

export default function ForumPage() {
  const [posts, setPosts] = useState([]);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const { user } = useAuth0(); // Obtener el usuario autenticado
  const navigate = useNavigate(); // Usar useNavigate para la navegación

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error.message);
        setPosts([])
      }
    };

    getPosts();
  }, []);

  const handleCreatePost = async (newPost) => {
    try {
      const createdPost = await createPost(newPost);
      setPosts((prev) => [createdPost, ...prev]);
      setIsCreatingPost(false);
      // Navegar a la URL con el nombre del usuario como parámetro
      navigate(`/post/${createdPost._id}?username=${user.name}`);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-6">
      {!isCreatingPost && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Recent Discussions</h2>
          <button
            onClick={() => setIsCreatingPost(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            + Create Post
          </button>
        </div>
      )}

      {isCreatingPost ? (
        <CreatePost onCreatePost={handleCreatePost} onClose={() => setIsCreatingPost(false)} />
      ) : (
        <PostsList posts={posts} onPostClick={(postId) => navigate(`/post/${postId}`)} />
      )}
    </main>
  );
}