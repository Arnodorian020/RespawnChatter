import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import PostsList from '../components/forum/PostsList';
import CreatePost from '../components/forum/CreatePost';
import { fetchPosts, createPost } from '../services/forumService';

export default function ForumPage() {
  const [posts, setPosts] = useState([]);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const navigate = useNavigate(); // Usar useNavigate aquí

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    getPosts();
  }, []);

  const handleCreatePost = async (newPost) => {
    try {
      const createdPost = await createPost(newPost.title, newPost.content, newPost.tags);
      setPosts((prev) => [createdPost, ...prev]);
      setIsCreatingPost(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`); // Navegar al post específico
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
        <PostsList posts={posts} onPostClick={handlePostClick} />
      )}
    </main>
  );
}
