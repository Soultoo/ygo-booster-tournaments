import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import app from './firebaseStuff';

const auth = getAuth(app);

function LoginCheck() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  

return (
  <div >
    {user ? (
      <div>Welcome, {user.email}!</div>
    ) : (
      <div>Please log in.</div>
    )}
  </div>
);
}

export default LoginCheck;






