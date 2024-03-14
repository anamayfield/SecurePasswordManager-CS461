import { createSupaClient, signOut } from './Authentication/Authenticate';

export const handleSignOut = async (navigate, cookies) => {
  try {
    const supabase = createSupaClient();
    await signOut(supabase);
    cookies.remove('parentId');
    navigate('/login');
  } catch (error) {
    console.error('Error signing out:', error.message);
  }
};
