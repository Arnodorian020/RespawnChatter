import React, { useState, useEffect } from 'react';
import PostsList from '../components/PostsList';
import CreatePost from '../components/CreatePost';
import { fetchPosts, createPost } from '../services/forumService';

export default function HomePage({ onPostClick }) {
  const [posts, setPosts] = useState([]);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

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
        <PostsList posts={posts} onPostClick={onPostClick} />
      )}
    </main>
  );
}
