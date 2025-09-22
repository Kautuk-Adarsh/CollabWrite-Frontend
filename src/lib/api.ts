const API_BASE_URL = 'http://localhost:5000';

export const api = {

  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },
  logout: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return res.json();
  },
  getCurrentUser: async () => {
    const res = await fetch(`${API_BASE_URL}/user/me`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', 
    });
    if(!res.ok){
      throw new Error('Failed to fetch the user data')
    }
    return res.json();
  },

  register: async (username: string, email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    return res.json();
  },


  getAllDocuments: async () => {
    const res = await fetch(`${API_BASE_URL}/docs/all`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return res.json();
  },

  createDocument: async (title: string, content: string) => {
    const res = await fetch(`${API_BASE_URL}/docs/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, content }),
    });
    return res.json();
  },

  getDocumentById: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/docs/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return res.json();
  },

  updateDocument: async (id: string, title: string, content: string) => {
    const res = await fetch(`${API_BASE_URL}/docs/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
      credentials: 'include',
    });
    return res.json();
  },

  deleteDocument: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/docs/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return res.json();
  },


  getCollaborators: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/docs/${id}/collaborators`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return res.json();
  },

  addCollaborator: async (id: string, collaboratorId: string) => {
    const res = await fetch(`${API_BASE_URL}/docs/${id}/add-collaborator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ collaboratorId }),
    });
    return res.json();
  },

  removeCollaborator: async (id: string, collaboratorId: string) => {
    const res = await fetch(`${API_BASE_URL}/docs/${id}/remove-Collaborator`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ collaboratorId }),
    });
    return res.json();
  },


  getVersions: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/docs/${id}/versions`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return res.json();
  },

  restoreVersion: async (docId: string, versionId: string) => {
    const res = await fetch(`${API_BASE_URL}/docs/${docId}/versions/${versionId}/restore`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return res.json();
  },


  deleteVersion: async (docId: string, versionId: string) => {
    const res = await fetch(`${API_BASE_URL}/docs/${docId}/versions/${versionId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return res.json();
  },
  searchUsers: async (query: string) => {
    const res = await fetch(`${API_BASE_URL}/user/search?query=${query}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return res.json();
  },
};