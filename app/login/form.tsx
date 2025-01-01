'use client';
import { useActionState } from "react";
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
const signupAction = async (state: SignupState, formData: FormData): Promise<SignupState> => {
  try {
    const result = await signup(formData);
    return {
      error: result.error || {} // Ensure we always return an object for error
    };
  } catch (e) { // Renommé error en e pour éviter l'avertissement
    // On peut aussi utiliser l'erreur si on veut
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
  const [state, action] = useActionState(signupAction, initialState);

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