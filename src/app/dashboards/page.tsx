// app/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
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

const calculateStats = (data: number[]) => {
    if (data.length === 0) return {};

    const min = Math.min(...data);
    const max = Math.max(...data);
    const mean = data.reduce((a, b) => a + b, 0) / data.length;

    data.sort((a, b) => a - b);
    const mid = Math.floor(data.length / 2);
    const median = data.length % 2 !== 0 ? data[mid] : (data[mid - 1] + data[mid]) / 2;

    const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);

    const getQuartile = (arr: number[], q: number) => {
        const pos = (arr.length - 1) * q;
        const base = Math.floor(pos);
        const rest = pos - base;
        if ((arr[base + 1] !== undefined)) {
            return arr[base] + rest * (arr[base + 1] - arr[base]);
        } else {
            return arr[base];
        }
    };

    const q1 = getQuartile(data, 0.25);
    const q2 = getQuartile(data, 0.5);
    const q3 = getQuartile(data, 0.75);

    const mode = (() => {
        const freq: { [key: number]: number } = {};
        let maxFreq = 0;
        let mode = [];
        for (const num of data) {
            freq[num] = (freq[num] || 0) + 1;
            if (freq[num] > maxFreq) {
                maxFreq = freq[num];
                mode = [num];
            } else if (freq[num] === maxFreq) {
                mode.push(num);
            }
        }
        if (mode.length === Object.keys(freq).length) mode = []; // no mode if all values are equally frequent
        return mode;
    })();

    return { min, max, mean, median, mode, range: max - min, stdDev, variance, q1, q2, q3 };
};

const Card: React.FC<{ title: string, stats: { [key: string]: number | number[] | string } }> = ({ title, stats }) => (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
        <h4 className="text-xl font-semibold mb-4 text-center">{title}</h4>
        <ul>
            {Object.entries(stats).map(([key, value]) => (
                <li key={key} className="mb-2 text-center">{key}: {Array.isArray(value) ? value.join(', ') : value}</li>
            ))}
        </ul>
    </div>
);

const Home: React.FC = () => {
    const [data, setData] = useState<Data[]>([]);
    const [temperatureStats, setTemperatureStats] = useState({});
    const [humidityStats, setHumidityStats] = useState({});
    const [lembabStats, setLembabStats] = useState({});
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://34.125.57.73/getdata.php');
                const json = await res.json();
                setData(json);
                setTemperatureStats(calculateStats(json.map((d: Data) => d.temperature)));
                setHumidityStats(calculateStats(json.map((d: Data) => d.humidity)));
                setLembabStats(calculateStats(json.map((d: Data) => d.lembab)));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-blue-600 text-white p-4 shadow-md text-center">
                <nav className="flex justify-around">
                    <a href="/dashboards" onClick={(e) => { e.preventDefault(); router.push('/dashboards'); }} className="hover:underline">Dashboard</a>
                    <a href="/tables" onClick={(e) => { e.preventDefault(); router.push('/tables'); }} className="hover:underline">Tampil Data</a>
                    <a href="/charts" onClick={(e) => { e.preventDefault(); router.push('/charts'); }} className="hover:underline">Tampil Chart</a>
                    <a href="/logout" onClick={(e) => { e.preventDefault(); router.push('/'); }} className="hover:underline">Logout</a>
                </nav>
            </header>
            <div className="container mx-auto p-4">
                <h3 className="text-2xl font-bold mb-6 text-center">Analisis Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card title="Statistik Suhu" stats={temperatureStats} />
                    <Card title="Statistik Kelembapan Udara" stats={humidityStats} />
                    <Card title="Statistik Kelembapan Tanah" stats={lembabStats} />
                </div>
            </div>
        </div>
    );
    
};

export default Home;
