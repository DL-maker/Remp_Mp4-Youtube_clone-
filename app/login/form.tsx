'use client';
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { signup } from './actions';

// Définition des types

export interface SignupState {
  error?: Record<string, string[]>;
  success?: boolean;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

// Wrapper pour l'action signup
const signupAction = async (formData: FormData): Promise<SignupState> => {
  try {
    const result = await signup(formData, window.location.origin);
    if ('error' in result) {
      return {
        success: false,
        error: result.error
      };
    }
    return {
      success: result.success,
      error: {}
    };
  } catch (e) {
    console.error('Signup error:', e);
    return {
      error: {
        username: ['Une erreur est survenue'],
      }
    };
  }
};

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
  const initialState: SignupState = { error: {} };
  const [state, setState] = useState(initialState);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await signupAction(formData);
    setState(result);
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
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