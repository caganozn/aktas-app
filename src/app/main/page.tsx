"use client"

import Image from 'next/image'
import app from "@/firebase/firebaseApp";
import { useAuthState } from "react-firebase-hooks/auth";
import {auth} from "@/firebase/firebaseApp";
import RegisterCustomer from '@/components/registerCustomer';
import CustomerList from '@/components/customerList';
import { useRouter } from "next/navigation";
import {getAuth} from "firebase/auth";
import React, { useEffect } from "react";


export default function Home() {
  app;
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);
  return (
    <main>
      <RegisterCustomer />
      <CustomerList/>
    </main>
  )
}