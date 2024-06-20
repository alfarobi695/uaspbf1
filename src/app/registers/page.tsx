"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../dashboard.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);
            formData.append('email', email);

            const response = await fetch('http://34.125.57.73/register.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
            });

            const data = await response.json();

            setMessage(data.message);

            if (data.message === 'Registration successful') {
                // Delay redirect to login page
                setTimeout(() => {
                    router.push('/');
                }, 2000); // 2000 milliseconds = 2 seconds delay
            }


        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };

    return (
        <div className="container1">
            <form onSubmit={handleSubmit} className="card">
                <h2>Register</h2>
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
                    onChange={(e) => setPassword(e.target.value)}
                    className='input'
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='input'
                    required
                />
                <button type="submit">Register</button>
                {message && <p>{message} will redirect to login</p>}
            </form>
        </div>
    );
};

export default Register;
