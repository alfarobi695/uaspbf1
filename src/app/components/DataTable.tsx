import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';

interface Data {
    id: number;
    temperature: number;
    humidity: number;
    lembab: number;
    waktu: string;
    tanggal: string;
}

interface DataTableProps {
    data: Data[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Data; direction: 'ascending' | 'descending' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const sortedData = React.useMemo(() => {
        let sortableData = [...data];
        if (sortConfig !== null) {
            sortableData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableData;
    }, [data, sortConfig]);

    const requestSort = (key: keyof Data) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const filteredData = sortedData.filter((item) =>
        item.id.toString().includes(searchTerm) ||
        item.temperature.toString().includes(searchTerm) ||
        item.humidity.toString().includes(searchTerm) ||
        item.lembab.toString().includes(searchTerm) ||
        item.waktu.includes(searchTerm) ||
        item.tanggal.includes(searchTerm)
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = itemsPerPage === -1 ? filteredData : filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = itemsPerPage === -1 ? 1 : Math.ceil(filteredData.length / itemsPerPage);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = Number(event.target.value);
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    const getSortArrow = (key: keyof Data) => {
        if (!sortConfig) return null;
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? '↑' : '↓';
        }
        return null;
    };

    return (
        <div className="container mx-auto p-4">
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="block w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <div className="mb-4 flex items-center justify-between">
                <label>
                    Items per page:
                    <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="ml-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={-1}>All</option>
                    </select>
                </label>
            </div>
            <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-2 border border-gray-300 cursor-pointer" onClick={() => requestSort('id')}>
                            ID {getSortArrow('id')}
                        </th>
                        <th className="p-2 border border-gray-300 cursor-pointer" onClick={() => requestSort('temperature')}>
                            Suhu {getSortArrow('temperature')}
                        </th>
                        <th className="p-2 border border-gray-300 cursor-pointer" onClick={() => requestSort('humidity')}>
                            Kelembapan Udara {getSortArrow('humidity')}
                        </th>
                        <th className="p-2 border border-gray-300 cursor-pointer" onClick={() => requestSort('lembab')}>
                            Kelembapan Tanah {getSortArrow('lembab')}
                        </th>
                        <th className="p-2 border border-gray-300 cursor-pointer" onClick={() => requestSort('waktu')}>
                            Waktu {getSortArrow('waktu')}
                        </th>
                        <th className="p-2 border border-gray-300 cursor-pointer" onClick={() => requestSort('tanggal')}>
                            Tanggal {getSortArrow('tanggal')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-100">
                            <td className="p-2 border border-gray-300 text-center">{index + 1 + indexOfFirstItem}</td>
                            <td className="p-2 border border-gray-300 text-center">{item.temperature}</td>
                            <td className="p-2 border border-gray-300 text-center">{item.humidity}</td>
                            <td className="p-2 border border-gray-300 text-center">{item.lembab}</td>
                            <td className="p-2 border border-gray-300 text-center">{item.waktu}</td>
                            <td className="p-2 border border-gray-300 text-center">{item.tanggal}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {itemsPerPage !== -1 && (
                <div className="mt-4 flex items-center justify-between">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-300 rounded-md cursor-pointer"
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-gray-300 rounded-md cursor-pointer"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default DataTable;
