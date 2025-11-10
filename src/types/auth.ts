export type RegisterData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  uid: string;
  email: string;
  nome: string; // Mudado de 'name' para 'nome'
  password: string;
  createdAt: Date;
  imagemUrl?: string; // Adicionado campo opcional
}
export interface PerfilProps {
  nome: string;
  email: string;
  imagemUrl: string;
}