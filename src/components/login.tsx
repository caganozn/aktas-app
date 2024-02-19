"use client";

// Import statements for Firebase functionality, React hooks, and Next.js components.
import app from "@/firebase/firebaseApp";
import React, { useEffect } from "react";
import Link from "next/link";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import {auth} from "@/firebase/firebaseApp";

  // React state hooks for managing user state, input fields, and error messages.
export default function Login() {
  app;
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  // Redirecting authenticated users to a specific page.
  useEffect(() => {
    if (user) {
      router.push("/main");
    }
  }, [user, router]);

  const [error, setError] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  async function loginUser(password: string, email: string) {
    if (password === "" || email === "") {
      setError("Please fill in all fields!");
    }
    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      router.push("/"); // redirecting to home page upon successful login
    } catch (error) {
      console.error("Error logging in:", error); // error handling
    }
  }

  if (loading) return <h1>Loading...</h1>; // Loading state UI

    // Login form UI
  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-blue-400 to-purple-500 items-center justify-center">
      <img src="/loginaktest.png" alt="Logo" className="mb-8" />
      <div className="bg-white w-full md:max-w-md lg:max-w-full md:w-1/2 xl:w-1/3 px-6 lg:px-16 xl:px-12 flex items-center justify-center shadow-lg rounded-lg">
        <div className="w-full h-100">
          <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">
            Log in to your account
          </h1>
          <form className="mt-6 p-6" action="#" method="POST">
            <div>
              <label className="block text-gray-700">Email Address</label>
              <input
                type="email"
                name=""
                placeholder="Enter Email Address"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                autoFocus
                autoComplete="on"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name=""
                placeholder="Enter Password"
                minLength={6}
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg px-4 py-3 mt-6"
              onClick={() => loginUser(password, email)}
            >
              Log In
            </button>
          </form>
          {error && <p className="mt-4 text-center text-base mb-3 font-bold text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}
