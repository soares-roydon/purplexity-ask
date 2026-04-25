import { createClient } from "@supabase/supabase-js";

export function Auth() {
  const supabase = createClient(
    process.env.BUN_PUBLIC_SUPABASE_URL!,
    process.env.BUN_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );

  function login(provider: "github" | "google") {
    supabase.auth.signInWithOAuth({
      provider: provider,
    });
  }

  return (
    <div>
      <button
        onClick={() => {
          login("google");
        }}
      >
        Google
      </button>
      <button
        onClick={() => {
          login("github");
        }}
      >
        GitHub
      </button>
    </div>
  );
}