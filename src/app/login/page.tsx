"use client";

import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Image from "next/image";
import { useState } from "react";

export default function Login() {
  const provider = new GoogleAuthProvider();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      setLoading(false);
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center flex-col">
        <div className="bg-white rounded-full px-5 mb-5 shadow-lg">
          <Image src="/logo.png" alt="Corn icon" width={100} height={100} />
        </div>

        <h1 className="text-4xl font-bold mt-5">Welcome to CornBob</h1>
        <p className="max-w-1/2 my-5">
          The best experience in buying corn of unbeatable quality
        </p>
        <button className="btn-corn" disabled={loading} onClick={handleSignIn}>
          <Image src="/google.svg" alt="Google icon" width={20} height={20} />
          {loading ? "Logging in..." : "Log In with Google"}
        </button>
      </div>
    </div>
  );
}
