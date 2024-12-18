import LoginForm from './LoginForm'; // Import the LoginForm component
import SignIn from '@/components/sign-in';
export default function LoginPage() { // To avoid the server in client error
  return (
    <div>
      <LoginForm />
      <SignIn />
    </div>
  );
}