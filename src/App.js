import React, { useState, useEffect } from 'react';
import PostsList from './components/PostsList';
import PostComponent from './components/Post';
import CreatePost from './components/CreatePost'; // Importar el nuevo componente
import { fetchPosts, fetchPostById, fetchAllCommentsByPost, createComment, createReply, votePost, createPost } from './services/forumService';

function App() {
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false); // Estado para manejar la creación de posts

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

  useEffect(() => {
    if (selectedPostId) {
      const getPostDetails = async () => {
        try {
          const post = await fetchPostById(selectedPostId);
          const comments = await fetchAllCommentsByPost(selectedPostId);
          setSelectedPost({ ...post, comments });
        } catch (error) {
          console.error('Error fetching post details:', error);
        }
      };

      getPostDetails();
    }
  }, [selectedPostId]);

  const addComment = async (postId, content) => {
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

  const addReply = async (postId, commentId, content) => {
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

  const handleVotePost = async (postId, direction) => {
    try {
      await votePost(postId, direction);
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? { ...post, votes: post.votes + (direction === 'up' ? 1 : -1) }
            : post
        )
      );
    } catch (error) {
      console.error('Error voting post:', error);
    }
  };

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
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">Discussion Forum</h1>
            {selectedPostId && (
              <button
                onClick={() => {
                  setSelectedPostId(null);
                  setSelectedPost(null);
                }}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
              >
                ← Back to Posts
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {!selectedPostId && !isCreatingPost && (
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
        ) : selectedPost ? (
          <PostComponent
            post={selectedPost}
            onAddComment={(content) => addComment(selectedPost._id, content)}
            onVotePost={(direction) => handleVotePost(selectedPost._id, direction)}
            onVoteComment={(commentId, direction) => handleVotePost(commentId, direction)}
            onAddReply={(parentId, content) => addReply(selectedPost._id, parentId, content)}
          />
        ) : (
          <PostsList posts={posts} onPostClick={setSelectedPostId} />
        )}
      </main>
    </div>
  );
}

export default App;
