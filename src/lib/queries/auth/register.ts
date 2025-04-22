import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';

export async function registerUser(name: string, email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    await updateProfile(userCredential.user, {
      displayName: name,
    });

    const token = await userCredential.user.getIdToken();

    return {
      user: userCredential.user,
      token,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Erro ao criar usuário:', error.message);
      throw new Error(error.message);
    }
  
    throw new Error('Erro desconhecido ao criar usuário.');
  }
}