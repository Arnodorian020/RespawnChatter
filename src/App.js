import React, { useState } from 'react';
import PostPage from './pages/PostPage';
import ForumPage from './pages/ForumPage';

function App() {
  const [selectedPostId, setSelectedPostId] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">Discussion Forum</h1>
          </div>
        </div>
      </header>

      {selectedPostId ? (
        <PostPage postId={selectedPostId} onBack={() => setSelectedPostId(null)} />
      ) : (
        <ForumPage onPostClick={setSelectedPostId} />
      )}
    </div>
  );
}

export default App;
