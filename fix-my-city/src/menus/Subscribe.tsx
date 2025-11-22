import '../static/style.css'
import { useState } from 'react';
import { API_URL } from '../config';

const Subscribe = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    newUsername: username,
                    newPassword: password,
                    name: name,
                    email: email
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
            <h2>New Account</h2>
                <form onSubmit={onSubmit}>
                    <table>
                        <tbody>
                        <tr>
                            <td className="inscription">Nom d'utilisateur </td>
                            <td>
                                <input 
                                    id="newUsername" 
                                    type="text" 
                                    placeholder='Username'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="inscription">Mot de passe </td>
                            <td>
                                <input 
                                    id="newPassword" 
                                    type="password" 
                                    placeholder='Password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="inscription">Nom complet </td>
                            <td>
                                <input 
                                    id="name" 
                                    type="text" 
                                    placeholder='Name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="inscription">Adresse e-mail</td>
                            <td>
                                <input 
                                    id="email" 
                                    type="email" 
                                    placeholder='Email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input 
                                    type="submit" 
                                    value={isLoading ? "Loading..." : "Subscribe"}
                                    disabled={isLoading}
                                />
                            </td>
                            <td></td>
                        </tr>
                        </tbody>
                    </table>
                </form>
        </section>
    )
}

export default Subscribe;