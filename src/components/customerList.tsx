"use client";

import jsPDF from "jspdf";
import "jspdf-autotable";
import app from "@/firebase/firebaseApp";
import React, { useEffect } from "react";
import {
    getFirestore,
    collection,
    getDocs,
    Timestamp,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { updateDoc } from "firebase/firestore";

/**
 * Renders a list of customers with their details.
 */
export default function CustomerList() {
    app;

    /**
     * Represents a client with their details.
     */
    type Client = {
        name: string;
        surname: string;
        email: string;
        devices: string[]; 
        number: string;
        date?: Date;
    };
    
    const [users, setUsers] = React.useState<{ name: string, surname: string, email: string, devices: string[], number: string, date?: Date }[]>([]);

    const [hoveredClient, setHoveredClient] = React.useState<{ name: string; surname: string; email: string; devices: string[]; number: string; date?: Date } | null>(null);
    const [viewMode, setViewMode] = React.useState("table");
    const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());

    /**
     * Returns the number of days in a given month and year.
     * @param month - The month (1-12).
     * @param year - The year.
     * @returns The number of days in the given month and year.
     */
    function getDaysInMonth(month: number, year: number): number {
        return new Date(year, month, 0).getDate();
    }

    /**
     * Returns the day of the week that the first day of a given month and year falls on.
     * @param month - The month (1-12).
     * @param year - The year.
     * @returns The day of the week (0-6, where 0 is Sunday) that the first day of the given month and year falls on.
     */
    function getStartDayOfMonth(month: number, year: number): number {
        return new Date(year, month - 1, 1).getDay();
    }

    /**
     * Returns the name of a given month.
     * @param month - The month (1-12).
     * @returns The name of the given month.
     */
    function monthName(month: number): string {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return monthNames[month - 1];
    }

    /**
     * Generates a PDF file containing the list of customers.
     */
    function downloadCustomersAsPDF() {
        const doc = new jsPDF('landscape');
    
        // Table column titles
        const headers = [["Name", "Surname", "Email", "Device Types", "Number", "Date"]];
    
        // Transform user data into 2D array for table content
        const data = users.map(user => [
            user.name,
            user.surname,
            user.email,
            user.devices.join(", "),
            user.number,
            user.date ? user.date.toDateString() : "N/A"
        ]);
    
        (doc as any).autoTable({
            startY: 30,
            head: headers,
            body: data,
            styles: {
                fillColor: [220, 220, 220],
                textColor: 50,
                fontSize: 10
            },
            headStyles: {
                fillColor: [50, 50, 50],
                textColor: 255
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240]
            },
            columnStyles: {
                0: { cellWidth: 40 },
                1: { cellWidth: 40 },
                2: { cellWidth: 60 },
                3: { cellWidth: 50 },
                4: { cellWidth: 30 },
                5: { cellWidth: 40 }
            }
        });
    
        // Add a title above the table
        doc.setFontSize(20);
        doc.text("Customer List", 20, 20);
    
        // Trigger the PDF download
        doc.save("customers.pdf");
    }    

    /**
     * Represents the props for the Tooltip component.
     */
    type TooltipProps = {
        client: Client | null;
    };
    
    /**
     * Renders a tooltip with the details of a given client.
     * @param client - The client to display the details of.
     * @returns The tooltip component.
     */
    function Tooltip({ client }: TooltipProps) {
        if (!client) return null;
    
        return (
            <div className="absolute bg-white p-4 border rounded shadow w-fit font-semibold text-base">
                Name: {client.name} {client.surname}<br />
                Email: {client.email}<br />
                Number: {client.number}<br />
                Device: {client.devices}
            </div>
        );
    }

    async function handleRemove(user: Client) {     // Removal of a user from the list and Firestore.
        try {
            const db = getFirestore();
            const userRef = doc(db, "Clients", user.email); // Assuming email is a unique identifier for the clients
            await deleteDoc(userRef);
            
            const updatedUsers = users.filter(u => u.email !== user.email);
            setUsers(updatedUsers);
        } catch (error) {
            console.error("Error removing user: ", error);
        }
    }
    
    
    
    // useEffect hook to fetch users from Firestore on component mount.
    useEffect(() => {
        async function fetchUsers() {
            try {
                const db = getFirestore();
                const querySnapshot = await getDocs(collection(db, "Clients"));

                const usersList: Client[] = [];
                querySnapshot.forEach((doc: any) => {
                    const userData = doc.data();
                    userData.date = userData.date.toDate(); // Convert Timestamp to Date
                    usersList.push(userData);
                });

                usersList.sort((a, b) =>
                    (a.date as Date).getTime() - (b.date as Date).getTime()
                ); // Sorting users by date in descending order
                setUsers(usersList);
            } catch (error) {
                console.error("Error fetching users: ", error);
            }
        }

        fetchUsers();
    }, []);

    function formatDate(date: Date): string {     // Function to format dates for display.
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }
    
    
    // Render method including buttons for switching view modes and downloading the PDF, and conditionally rendering the table or calendar view.
    return (
        <div className="flex flex-col">
            <button className="mb-4 bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200" onClick={() => setViewMode(viewMode === "table" ? "calendar" : "table")}>
            Switch to {viewMode === "table" ? "Calendar" : "Table"} View
            </button>
            <button onClick={downloadCustomersAsPDF}>Download Customers as PDF</button>
            {viewMode === "calendar" && (
                <div className="mt-4">
                    {/* Calendar Header */}
                    <div className="flex justify-between items-center mb-4">
                        <button 
                            className="bg-blue-500 text-white px-4 py-2 rounded transition duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            onClick={() => {
                                if (currentMonth === 1) {
                                    setCurrentMonth(12);
                                    setCurrentYear(currentYear - 1);
                                } else {
                                    setCurrentMonth(currentMonth - 1);
                                }
                            }}
                        >
                            &lt;
                        </button>
                        <span className="text-lg font-semibold">{monthName(currentMonth)} {currentYear}</span>
                        <button 
                            className="bg-blue-500 text-white px-4 py-2 rounded transition duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            onClick={() => {
                                if (currentMonth === 12) {
                                    setCurrentMonth(1);
                                    setCurrentYear(currentYear + 1);
                                } else {
                                    setCurrentMonth(currentMonth + 1);
                                }
                            }}
                        >
                            &gt;
                        </button>
                    </div>

                    {/* Days of the week */}
                    <div className="grid grid-cols-7 gap-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="font-semibold text-center">{day}</div>
                        ))}
                    </div>

                    {/* Days of the month */}
                    <div className="grid grid-cols-7 gap-4 mt-2">
                        {Array.from({ length: getStartDayOfMonth(currentMonth, currentYear) }).map((_, index) => (
                            <div key={`blank-${index}`} className="border rounded p-4"></div>
                        ))}
                        {Array.from({ length: getDaysInMonth(currentMonth, currentYear) }).map((_, index) => {
                            const day = index + 1;
                            const currentDate = new Date();
                            const isToday = currentDate.getDate() === day && currentDate.getMonth() + 1 === currentMonth && currentDate.getFullYear() === currentYear;
                            const cellDate = new Date(currentYear, currentMonth - 1, day); // Create a Date object for the current cell
                            const isPastDate = cellDate < currentDate; // Check if the cell date is in the past
                            const clientsOnThisDay = users.filter(user => user.date && user.date.getDate() === day && user.date.getMonth() + 1 === currentMonth && user.date.getFullYear() === currentYear);
                            return (
                                <div key={index} className={`border rounded p-4 ${isToday ? (clientsOnThisDay.length ? 'bg-yellow-100' : 'bg-blue-100') : ''} ${clientsOnThisDay.length ? 'bg-green-100' : ''} ${clientsOnThisDay.length && isPastDate ? 'bg-red-100' : ''}`}>
                                    <div className="font-bold text-center">{day}</div>
                                    {clientsOnThisDay.map(client => (
                                        <div key={client.email} className="mt-1 text-xs text-center relative" onMouseEnter={() =>       setHoveredClient(client)} onMouseLeave={() => setHoveredClient(null)}>
                                            {client.name.charAt(0)}.{client.surname.charAt(0)}.
                                            {hoveredClient === client && <Tooltip client={hoveredClient} />}
                                        </div>

                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {viewMode === "table" && (
                <table className="min-w-full border-collapse border border-gray-300 text-left">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border border-gray-200 bg-gray-200">Name</th>
                            <th className="px-4 py-2 border border-gray-200 bg-gray-200">Surname</th>
                            <th className="px-4 py-2 border border-gray-200 bg-gray-200">Email</th>
                            <th className="px-4 py-2 border border-gray-200 bg-gray-200">Device Type</th>
                            <th className="px-4 py-2 border border-gray-200 bg-gray-200">Phone Number</th>
                            <th className="px-4 py-2 border border-gray-200 bg-gray-200">Date</th>
                            <th className="px-4 py-2 border border-gray-200 bg-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="px-4 py-2 border border-gray-200">{user.name}</td>
                                <td className="px-4 py-2 border border-gray-200">{user.surname}</td>
                                <td className="px-4 py-2 border border-gray-200">{user.email}</td>
                                <td className="px-4 py-2 border border-gray-200 device-list-cell"> 
                                    {user.devices.join(", ")} 
                                </td>
                                <td className="px-4 py-2 border border-gray-200">{user.number}</td>
                                <td className="px-4 py-2 border border-gray-200">{user.date ? formatDate(user.date) : 'N/A'}</td>
                                <td className="px-4 py-2 border border-gray-200">
                                    <button onClick={() => handleRemove(user)} className="text-red-500 hover:text-red-600">Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
