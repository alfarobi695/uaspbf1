// app/tables/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { useRouter } from 'next/navigation';
import 'tailwindcss/tailwind.css';

interface Data {
    id: number;
    temperature: number;
    humidity: number;
    lembab: number;
    waktu: string;
    tanggal: string;
}

const Tables: React.FC = () => {
    const [data, setData] = useState<Data[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://34.125.57.73/getdata.php');
                const json = await res.json();
                setData(json);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-blue-600 text-white p-4 shadow-md">
                <nav className="flex justify-around">
                    <a href="/dashboards" onClick={(e) => { e.preventDefault(); router.push('/dashboards'); }} className="hover:underline">Dashboard</a>
                    <a href="/tables" onClick={(e) => { e.preventDefault(); router.push('/tables'); }} className="hover:underline">Tampil Data</a>
                    <a href="/charts" onClick={(e) => { e.preventDefault(); router.push('/charts'); }} className="hover:underline">Tampil Chart</a>
                    <a href="/logout" onClick={(e) => { e.preventDefault(); router.push('/'); }} className="hover:underline">Logout</a>
                </nav>
            </header>
            <div className="container mx-auto p-4">
                <h3 className="text-2xl font-bold mb-6 text-center">Tabel Data</h3>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <DataTable data={data} />
                </div>
            </div>
        </div>
    );
};

export default Tables;
