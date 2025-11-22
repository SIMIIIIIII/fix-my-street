import { useState, useEffect } from 'react';
import '../static/style.css'
import { API_URL } from '../config';

interface User {
    username?: string;
    name?: string;
    email?: string;
    password?: string,
    incidentsId?: [],
}

const Account = () => {
    const [user, setUser] = useState<User | null>(null);
    
    useEffect(() => {
        fetch(`${API_URL}/account`, {
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.user) setUser(data.user);
            else window.location.href = '/account/login';
        })
        .catch(error => console.error('Error:', error));
    }, []);

    const onSubmit = async () => {
        try {
            const response = await fetch(`${API_URL}/account/logout`, {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) window.location.href = "/";

        } catch (error) {
            console.error('Error:', error);
        }
    }

    return(
        <section>

            <h2>Informations du compte</h2>
            <table>
                <tbody>
                <tr>
                    <td className="inscription">Username</td>
                    <td>{user?.username}</td>
                </tr>
                <tr>
                    <td className="inscription">Name</td>
                    <td>{user?.name}</td>
                </tr>
                <tr>
                    <td className="inscription">E-mail adress</td>
                    <td>{user?.email}</td>
                </tr>
                </tbody>
            </table>

            <br/>
            <form action={onSubmit}>
                <button type="submit" className="soumettre-button">Log out</button>
            </form>
        </section>
    )
}

export default Account;