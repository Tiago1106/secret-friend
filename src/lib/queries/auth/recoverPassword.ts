import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';

export async function recoverPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('Email de recuperação enviado!');
    return 'Um e-mail de recuperação foi enviado!';
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Erro ao enviar e-mail de recuperação:', error.message);
      throw new Error(error.message);
    }
    throw new Error('Erro desconhecido ao tentar enviar o e-mail de recuperação.');
  }
}