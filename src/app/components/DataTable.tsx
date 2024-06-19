import React, { useState } from 'react';

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
        <div>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                style={{ marginBottom: '10px', padding: '5px' }}
            />
            <div style={{ marginBottom: '10px' }}>
                <label>
                    Items per page:
                    <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={-1}>All</option>
                    </select>
                </label>
            </div>
            <table style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th onClick={() => requestSort('temperature')}>Temperature {getSortArrow('temperature')}</th>
                        <th onClick={() => requestSort('humidity')}>Humidity {getSortArrow('humidity')}</th>
                        <th onClick={() => requestSort('lembab')}>Lembab {getSortArrow('lembab')}</th>
                        <th onClick={() => requestSort('waktu')}>Waktu {getSortArrow('waktu')}</th>
                        <th onClick={() => requestSort('tanggal')}>Tanggal {getSortArrow('tanggal')}</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item, index) => (
                        <tr key={item.id}>
                            <td data-label="ID">{index + 1 + indexOfFirstItem}</td>
                            <td data-label="Temperature">{item.temperature}</td>
                            <td data-label="Humidity">{item.humidity}</td>
                            <td data-label="Lembab">{item.lembab}</td>
                            <td data-label="Waktu">{item.waktu}</td>
                            <td data-label="Tanggal">{item.tanggal}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {itemsPerPage !== -1 && (
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default DataTable;
