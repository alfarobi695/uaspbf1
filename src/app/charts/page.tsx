// app/charts/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import LineChart from '../components/LineChart';
import { ChartData } from 'chart.js';
import 'tailwindcss/tailwind.css';
import { useRouter } from 'next/navigation';

interface Data {
  id: number;
  temperature: number;
  humidity: number;
  lembab: number;
  waktu: string;
  tanggal: string;
}

const Charts: React.FC = () => {
  const [data, setData] = useState<Data[]>([]);
  const [intervalType, setIntervalType] = useState<'minute' | 'hour'>('minute'); // State untuk memilih interval
  const [selectedData, setSelectedData] = useState<'temperature' | 'humidity' | 'lembab' | 'all'>('temperature'); // State untuk memilih jenis data
  const [showAllData, setShowAllData] = useState<boolean>(false); // State untuk menunjukkan apakah semua data ditampilkan
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

  const groupDataBy = (interval: 'hour' | 'minute') => {
    const groupedData: { [key: string]: Data[] } = {};

    data.forEach((item) => {
      const date = new Date(`${item.tanggal}T${item.waktu}`);
      let key: string;

      if (interval === 'hour') {
        key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:00`;
      } else {
        key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
      }

      if (!groupedData[key]) {
        groupedData[key] = [];
      }
      groupedData[key].push(item);
    });

    return groupedData;
  };

  const transformGroupedData = (groupedData: { [key: string]: Data[] }, key: keyof Data): ChartData<'line'> => {
    const labels = Object.keys(groupedData);
    const dataPoints = labels.map(label => {
      const group = groupedData[label];
      const sum = group.reduce((acc, item) => acc + item[key], 0);
      return sum / group.length;
    });

    return {
      labels,
      datasets: [
        {
          label: key.charAt(0).toUpperCase() + key.slice(1),
          data: dataPoints,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        },
      ],
    };
  };

  const handleIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIntervalType(e.target.value as 'minute' | 'hour');
  };

  const handleDataChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'all') {
      setSelectedData('all');
      setShowAllData(true);
    } else {
      setSelectedData(value as 'temperature' | 'humidity' | 'lembab');
      setShowAllData(false);
    }
  };

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
      <div className="container mx-auto p-4 text-center">
        <div className="mb-4">
          <label htmlFor="interval" className="block text-sm font-medium text-gray-700">Pilih Interval:</label>
          <select id="interval" value={intervalType} onChange={handleIntervalChange} className="ml-2 block w-full  p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
            <option value="minute">Per Menit</option>
            <option value="hour">Per Jam</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="dataSelector" className="block text-sm font-medium text-gray-700">Pilih Data:</label>
          <select id="dataSelector" value={selectedData} onChange={handleDataChange} className="ml-2 block w-full  p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
            <option value="temperature">Suhu</option>
            <option value="humidity">Kelembapan Udara</option>
            <option value="lembab">Kelembapan Tanah</option>
            <option value="all">Semua Data</option>
          </select>
        </div>
        {showAllData ? (
          <>
            <div id="temperature" className="mb-4">
              <h3 className="text-xl font-bold mb-2">Grafik Data Suhu</h3>
              <LineChart data={transformGroupedData(groupDataBy(intervalType), 'temperature')} />
            </div>
            <div id="humidity" className="mb-4">
              <h3 className="text-xl font-bold mb-2">Grafik Data Kelembapan Udara</h3>
              <LineChart data={transformGroupedData(groupDataBy(intervalType), 'humidity')} />
            </div>
            <div id="lembab" className="mb-4">
              <h3 className="text-xl font-bold mb-2">Grafik Data Kelembapan Tanah</h3>
              <LineChart data={transformGroupedData(groupDataBy(intervalType), 'lembab')} />
            </div>
          </>
        ) : (
          <div id="chart" className="mb-4">
            <h3 className="text-xl font-bold mb-2">Grafik Data {selectedData === 'temperature' ? 'Suhu' : selectedData === 'humidity' ? 'Kelembapan Udara' : 'Kelembapan Tanah'}</h3>
            <LineChart data={transformGroupedData(groupDataBy(intervalType), selectedData)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Charts;
