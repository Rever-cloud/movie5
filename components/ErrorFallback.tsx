"use client";

interface ErrorFallbackProps {
  error?: Error;
  reset?: () => void;
}

export default function ErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center" role="alert">
      <div className="w-20 h-20 rounded-full bg-accent-500/10 flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
      <p className="text-gray-400 mb-6 max-w-md">
        {error?.message || "An unexpected error occurred. Please try again."}
      </p>
      {reset && (
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl bg-accent-500 hover:bg-accent-400 text-white font-semibold transition-all duration-200 shadow-lg shadow-accent-500/25"
          type="button"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
