import { createClient, type User } from "@supabase/supabase-js";
import { Divide } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const supabase = createClient(
  process.env.BUN_PUBLIC_SUPABASE_URL!,
  process.env.BUN_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

export function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getInfo() {
      const { data, error } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      }
    }
    getInfo();
  }, []);

  return (
    <div>
      {!user && (
        <button
          onClick={() => {
            navigate("/auth");
          }}
        >
          Sign in
        </button>
      )}
      {user && 
        <div>
          {user?.email}
          <button
            onClick={() => {
              supabase.auth.signOut;
              setUser(null);
            }}
          >
            Logout
          </button>
        </div>
      }
    </div>
  );
}
