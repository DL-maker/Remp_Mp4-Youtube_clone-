'use client';
import { useFormState, useFormStatus } from "react-dom";
import { signup } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      {pending ? 'Submitting...' : 'Sign Up'}
    </button>
  );
}

export function SignUpForm() {
  const initialState = { error: {} };
  const [state, action] = useFormState(signup, initialState);

  return (
    <div className="w-full max-w-md">
      <form action={action} className="space-y-4">
        <div>
          <input 
            name="username" 
            type="text" 
            placeholder="Username"
            className="w-full p-2 border rounded"
          />
          {state?.error?.username && (
            <span className="text-red-500 text-sm">{state.error.username[0]}</span>
          )}
        </div>
        
        <div>
          <input 
            name="email" 
            type="email" 
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
          {state?.error?.email && (
            <span className="text-red-500 text-sm">{state.error.email[0]}</span>
          )}
        </div>
        
        <div>
          <input 
            name="password" 
            type="password" 
            placeholder="Password"
            className="w-full p-2 border rounded"
          />
          {state?.error?.password && (
            <span className="text-red-500 text-sm">{state.error.password[0]}</span>
          )}
        </div>
        
        <SubmitButton />
      </form>
    </div>
  );
}