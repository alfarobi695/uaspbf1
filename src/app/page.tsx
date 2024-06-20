'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import 'tailwindcss/tailwind.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch('http://34.125.57.73/signin.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      }); 

      const data = await response.json();

      setMessage(data.message);

      if (data.message === 'Login successful') {
        // Delay redirect to login page
        setTimeout(() => {
          router.push('/dashboards');
        }, 2000); // 2000 milliseconds = 2 seconds delay
      }

    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700 transition duration-200">
          Sign In
        </button>
        {message && <p className="mt-4 text-center text-gray-700">{message} will redirect to dashboard</p>}
        <div className="mt-4 text-center">
          <a href="/registers" onClick={(e) => { e.preventDefault(); router.push('/registers'); }} className="text-blue-600 hover:underline">
            Register
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
