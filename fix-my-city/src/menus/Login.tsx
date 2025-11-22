import { Link } from 'react-router-dom';
import '../static/style.css'
import { useState } from 'react';
import { API_URL } from '../config';

const Login = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: username,
                    password: password,
                })
            });

            if (response.ok) {
                window.location.href = '/';
            } else {
                const data = await response.json();
                setErrorMessage(data.error || 'An error occuried');
            }
        } catch (error) {
            setErrorMessage('Server error');
            console.error('Submit error:', error);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <section>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <br/>

            <h2>Log in</h2>
                <form onSubmit={onSubmit}>
                    <table>
                        <tbody>
                        <tr>
                            <td className="inscription">Username</td>
                            <td>
                                <input
                                    type="text"
                                    id="username"
                                    placeholder='usename'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="inscription">Password</td>
                            <td>
                                <input 
                                    id="password"
                                    type="password"
                                    placeholder='password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input
                                    type="submit"
                                    value={isLoading ? "Loading..." : "Log in"}
                                    disabled={isLoading}
                                />
                            </td>
                            <td></td>
                        </tr>
                        </tbody>
                    </table>
                </form>
            <h3> <Link to="/subscribe">Create a new account</Link> </h3>
        </section>
    )
}

export default Login;