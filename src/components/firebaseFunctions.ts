import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('registered: ', userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('Reg Error: ', error);
    throw error;
  }
};
