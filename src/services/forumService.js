const API_URL = 'http://localhost:3002';

async function fetchPosts() {
  const response = await fetch(`${API_URL}/posts`);
  if (!response.ok) {
    throw new Error('Error al obtener los posts');
  }
  return response.json();
}

async function fetchPostById(postId) {
  const response = await fetch(`${API_URL}/posts/${postId}`);
  if (!response.ok) {
    throw new Error('Error al obtener el post');
  }
  return response.json();
}

async function fetchCommentById(commentId) {
  const response = await fetch(`${API_URL}/comments/${commentId}`);
  if (!response.ok) {
    throw new Error('Error al obtener el comentario');
  }
  return response.json();
}

async function fetchAllCommentsByPost(postId) {
  const response = await fetch(`${API_URL}/posts/${postId}/allComments`);
  if (!response.ok) {
    throw new Error('Error al obtener los comentarios');
  }
  return response.json();
}

async function createComment(postId, request) {
  const { author, content } = request

  const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ author, content }),
  });
  if (!response.ok) {
    throw new Error('Error al crear el comentario');
  }
  return response.json();
}

async function createReply(postId, commentId, content) {
  const response = await fetch(`${API_URL}/posts/${postId}/comments/${commentId}/replies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    throw new Error('Error al crear la respuesta');
  }
  return response.json();
}

async function votePost(postId, direction) {
  const response = await fetch(`${API_URL}/posts/${postId}/vote`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ direction }),
  });
  if (!response.ok) {
    throw new Error('Error al votar el post');
  }
  return response.json();
}

async function createPost(postData) {
  const { title, content, tags, author, authorAvatar } = postData;

  // Verifica que tags sea un array antes de proceder
  if (!Array.isArray(tags)) {
    console.error('tags:', tags);
    throw new Error('Tags should be an array');
  }

  console.log('Data to send:', { title, content, tags, author, authorAvatar });

  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, content, tags, author, authorAvatar }),
  });

  if (!response.ok) {
    throw new Error('Error al crear el post');
  }

  return response.json();
}

export { fetchPosts, fetchPostById, fetchAllCommentsByPost, createComment, createReply, votePost, createPost };

