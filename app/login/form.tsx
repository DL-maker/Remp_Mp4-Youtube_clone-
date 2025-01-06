'use client';
import { useState, FormEvent } from "react";
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

interface SignupFormData {
  username: string;
  email: string;
  password: string;
}

// Wrapper pour l'action signup
const signupAction = async (formData: SignupFormData): Promise<SignupState> => {
  try {
    const result = await signup(formData as unknown as FormData, window.location.origin);
    if ('error' in result) {
      return {
        success: false,
        error: result.error
      };
    }
    // Redirection vers le profil après l'inscription
    window.location.href = '/profile';
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

function SubmitButton({ pending }: { pending: boolean }) {
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
  const [state, setState] = useState<SignupState>(initialState);
  const [pending, setPending] = useState<boolean>(false);

  const handleSubmit: HandleSubmit = async (event) => {
    event.preventDefault();
    setPending(true);
    const formData = new FormData(event.currentTarget);
    const result = await signupAction({
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    });
    setState(result);
    setPending(false);
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

        <SubmitButton pending={pending} />
      </form>
    </div>
  );
}

// Define function types
type HandleSubmit = (e: FormEvent<HTMLFormElement>) => Promise<void>;