const API_URL = 'http://localhost:3000';

async function fetchPosts() {
  try {
    const response = await fetch(`${API_URL}/posts`);
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('La respuesta no es un json')
    }
    const data = await response.json()
    if (!Array.isArray(data)) {
      throw new Error('La respuesta no es un array');
    }
    return data;
  } catch (error) {
    console.error('error al obtener los post', error.message)
    return [];
  }
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

async function createComment(postId, content) {
  const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
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

async function createPost(title, content, tags) {
  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, content, tags }),
  });
  if (!response.ok) {
    throw new Error('Error al crear el post');
  }
  return response.json();
}

export { fetchPosts, fetchPostById, fetchAllCommentsByPost, createComment, createReply, votePost, createPost };