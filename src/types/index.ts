export interface AuthState {
  username?: string;
  email: string;
  password?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface Version {
  _id: string;
  title: string;
  content: string;
  editedAt: string;
  editedBy: User;
}

export interface Document {
  _id: string;
  title: string;
  content: string;
  owner: User;
  collaborators: User[];
  versions: Version[];
  createdAt: string;
  updatedAt: string;
}