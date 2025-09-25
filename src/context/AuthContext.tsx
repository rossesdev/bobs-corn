"use client";

import { createContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import { AuthContextType, AuthProviderProps } from "@/types/auth";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setLoading(true);
          const token = await user.getIdToken();

          setUser(user);
          document.cookie = `sessionToken=${token}; path=/; max-age=3600; secure; samesite=strict`;

          if (pathname === "/login") {
            router.push("/");
          }
        } else {
          setUser(null);

          document.cookie =
            "sessionToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

          if (pathname === "") {
            router.push("/login");
          }
        }
      } catch (error) {
        console.error("Error", error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [router, pathname]);

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setUser(null);

      document.cookie =
        "sessionToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

      router.push("/login");
    } catch (error) {
      console.error("Error", error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
