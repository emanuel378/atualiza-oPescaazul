import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { User, RegisterData, LoginData } from '../types/auth';

export class AuthService {
  // Cadastrar novo usuário
  static async register(userData: RegisterData): Promise<User> {
    try {
      // 1. Criar usuário no Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );

      const user = userCredential.user;

      if (!user.email) {
        throw new Error('Email is required');
      }

      // 2. Atualizar perfil com o nome
      await updateProfile(user, {
        displayName: userData.name
      });

      // 3. Salvar dados adicionais no Firestore (COM SENHA - NÃO RECOMENDADO)
      const userDoc = {
        uid: user.uid,
        email: user.email,
        nome: userData.name, // Mudado de 'name' para 'nome'
        password: userData.password,
        createdAt: new Date(),
        imagemUrl: 'https://via.placeholder.com/150' // Adicionado imagemUrl padrão
      };

      // Primeiro salvar no Firestore
      await setDoc(doc(db, 'users', user.uid), userDoc);

      // Depois atualizar o perfil do Authentication
      await updateProfile(user, {
        displayName: userData.name
      });

      return userDoc;
    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw error;
    }
  }

  // Login do usuário
  static async login(loginData: LoginData): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );

      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Se não existir no Firestore, criar com dados padrão
        if (!user.email) {
          throw new Error('Email is required');
        }
        const defaultData = {
          uid: user.uid,
          email: user.email,
          nome: user.displayName || 'Usuário',
          password: loginData.password,
          createdAt: new Date(),
          imagemUrl: 'https://via.placeholder.com/150'
        };
        
        await setDoc(doc(db, 'users', user.uid), defaultData);
        return defaultData;
      }
      
      return userDoc.data() as User;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  }

  // Verificar se usuário está logado
  static getCurrentUser() {
    return auth.currentUser;
  }
}