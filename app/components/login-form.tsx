"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { createClient } from "~/lib/supabase/client";
import { cn } from "~/lib/utils";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?next=/dashboard`,
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <span className="text-4xl">Welcome back to arrey</span>
      <span className="text-gray-600">
        arrey helps moderne software teams complete authorization flows 10X
        faster
      </span>
      <Button
        type="submit"
        className="mt-6 w-full"
        disabled={isLoading}
        onClick={handleSocialLogin}
      >
       {/* TODO: make a reusable github btn */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="15"
          height="15"
          aria-hidden="true"
          role="img"
          className="flex-none"
        >
          <path
            fill="currentColor"
            d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.263.82-.583
             0-.288-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73
             1.205.085 1.84 1.238 1.84 1.238 1.07 1.835 2.807 1.305 3.492.997.108-.775.418-1.305.76-1.605-2.665-.304-5.466-1.332-5.466-5.93
             0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 0 1 3.003-.404c1.02.005 2.045.138 3.003.404
             2.29-1.552 3.296-1.23 3.296-1.23.656 1.653.244 2.874.12 3.176.77.84 1.235 1.91 1.235 3.22
             0 4.61-2.804 5.624-5.475 5.92.43.372.815 1.102.815 2.222 0 1.606-.015 2.903-.015 3.297
             0 .322.216.699.825.58C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z"
          />
        </svg>
        Sign in with Github
      </Button>
      {error && <span>{error}</span>}

    </div>
  );
}
