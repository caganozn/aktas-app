import Image from 'next/image'
import app from "@/firebase/firebaseApp";
import { useAuthState } from "react-firebase-hooks/auth";
import {auth} from "@/firebase/firebaseApp";
import Login from '@/components/login';


export default function Home() {
  app;
  return (
    <main>
      <Login />
    </main>
  )
}