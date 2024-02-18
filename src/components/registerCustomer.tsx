"use client";

import app from "@/firebase/firebaseApp";
import React from "react";
import { getFirestore, doc, getDoc, setDoc, Timestamp } from "firebase/firestore";


export default function RegisterCustomer() {
    app;

    const [feedback, setFeedback] = React.useState("");
    const [name, setName] = React.useState("");
    const [surname, setSurname] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [deviceType, setDevice] = React.useState("");
    const [number, setPhoneNumber] = React.useState("");
    const [date, setDate] = React.useState("");
    const jsDate = new Date(date);
    const timestamp = Timestamp.fromDate(jsDate);

  
    async function registerUser(
        email: string,
        name: string,
        surname: string,
        deviceType: string,
        number: string,
        date: Timestamp
    ) {
        try {
            if (
                name === "" ||
                surname === "" ||
                email === "" ||
                number === "" ||
                deviceType === "" ||
                !date
            ) {
                throw new Error("Please fill in all fields!");
            }
    
            const db = getFirestore();
            const userRef = doc(db, "Clients", email); // Using email as the document ID
            await setDoc(userRef, {
                name: name,
                surname: surname,
                email: email,
                deviceType: deviceType,
                number: number,
                date: date,
            });
            setFeedback("Registration successful!");
            setName("");
            setSurname("");
            setDevice("");
            setEmail("");
            setPhoneNumber("");
            setDate("");
        } catch (error) {
            console.error("Error registering user: ", error);
            if (typeof error === 'object' && error !== null && 'message' in error) {
                setFeedback(`Error: ${error.message}`);
            } else {
                setFeedback('An error occurred during registration.');
            }            
        }
    }
    
  

    return (
        <div className="flex flex-col w-full md:w-1/2 lg:w-1/3 mx-auto mt-10 p-6 shadow-lg rounded-md bg-white">
            <h1 className="text-center text-2xl font-bold mb-6">Register Customer</h1>
            <form className="flex flex-col justify-center content-center" onSubmit={(e) => {e.preventDefault(); const jsDate = new Date(date); const timestamp = Timestamp.fromDate(jsDate); registerUser(email, name, surname, deviceType, number, timestamp);}}>
                <label className="font-semibold mt-4" htmlFor="name">Name</label>
                <input className="border rounded-md p-2 mt-2 focus:outline-none focus:ring focus:border-blue-300 w-full" type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)}/>
                <label className="font-semibold mt-4" htmlFor="surname">Surname</label>
                <input className="border rounded-md p-2 mt-2 focus:outline-none focus:ring focus:border-blue-300 w-full" type="text" name="surname" id="surname" value={surname} onChange={(e) => setSurname(e.target.value)}/>
                <label className="font-semibold mt-4" htmlFor="device">Device Type</label>
                <select className="border rounded-md p-2 mt-2 focus:outline-none focus:ring focus:border-blue-300 w-full" name="device" id="device" value={deviceType} onChange={(e) => setDevice(e.target.value)}>
                    <option value="Option 1">Option 1</option>
                    <option value="Option 2">Option 2</option>
                    <option value="Option 3">Option 3</option>
                    <option value="Option 4">Option 4</option>
                    <option value="Option 5">Option 5</option>
                </select>
                <label className="font-semibold mt-4" htmlFor="expiration">Expiration Date</label>
                <input className="border rounded-md p-2 mt-2 focus:outline-none focus:ring focus:border-blue-300 w-full" type="date" name="expiration" id="expiration" value={date} onChange={(e) => setDate(e.target.value)}/>
                <label className="font-semibold mt-4" htmlFor="email">Email</label>
                <input className="border rounded-md p-2 mt-2 focus:outline-none focus:ring focus:border-blue-300 w-full" type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <label className="font-semibold mt-4" htmlFor="phone">Phone Number</label>
                <input className="border rounded-md p-2 mt-2 focus:outline-none focus:ring focus:border-blue-300 w-full" type="tel" name="phone" id="phone" value={number} onChange={(e) => setPhoneNumber(e.target.value)}/>
                <button type="submit" className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue">Register</button>
                {feedback && <p className="mt-4 text-center text-green-500">{feedback}</p>}
            </form>
        </div>
    );
}