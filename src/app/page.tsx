"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './dashboard.css';

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
    <div className="container1">
      <form onSubmit={handleSubmit} className="card">
        <h2>Sign In</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='input'
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          className='input'
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
        {message && <p>{message} will redirect to dashboard</p>}

        <a href="/registers" onClick={(e) => { e.preventDefault(); router.push('/registers'); }}>Register</a>
      </form>
    </div>
  );
};

export default Login;
