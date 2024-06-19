// app/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import './dashboard.css';
import DataTable from '../app/components/DataTable';
import { useRouter } from 'next/navigation';

interface Data {
  id: number;
  temperature: number;
  humidity: number;
  lembab: number;
  waktu: string; 
  tanggal: string;
}

const Home: React.FC = () => {
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
    <div className="dashboard">
      <header className="header">
        <nav>
          <a href="/" onClick={(e) => { e.preventDefault(); router.push('/'); }}>Tampil Data</a>
          <a href="/charts" onClick={(e) => { e.preventDefault(); router.push('/charts'); }}>Tampil Chart</a>
        </nav>
      </header>
      <div className="container">
        <h3>Data dari API</h3>
        <DataTable data={data} />
      </div>
    </div>
  );
};

export default Home;
