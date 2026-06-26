import { SignIn, useAuth } from '@clerk/clerk-react';

export default function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500 text-xl font-bold text-white">
            S
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            SmartNotes
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Sign in to manage your notes
          </p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'shadow-none border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900',
              headerTitle: 'text-zinc-900 dark:text-zinc-100',
              headerSubtitle: 'text-zinc-500 dark:text-zinc-400',
              formButtonPrimary: 'bg-accent-500 hover:bg-accent-600',
              formFieldLabel: 'text-zinc-700 dark:text-zinc-300',
              formFieldInput: 'input-field',
              dividerLine: 'bg-zinc-200 dark:bg-zinc-800',
              dividerText: 'text-zinc-400',
              socialButtonsBlockButton: 'border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300',
              footerActionLink: 'text-accent-600 hover:text-accent-700 dark:text-accent-400',
              footer: 'border-t border-zinc-200 dark:border-zinc-800',
            },
          }}
        />
      </div>
    </div>
  );
}
