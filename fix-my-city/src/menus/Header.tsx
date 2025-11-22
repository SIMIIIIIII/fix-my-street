import logo from "../images/logo.png"
import '../static/nav_style.css'
import { Link, useLocation } from "react-router-dom"
import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

interface User {
    username?: string;
}

const Header = () => {
    const [user, setUser] = useState<User | null>(null);
    const [words, setWords] = useState<string>("");
    const location = useLocation();

    useEffect(() => {
        fetch(`${API_URL}/nav`, {
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => setUser(data.user))
        .catch(error => console.error('Error:', error));
    }, [location]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch(`${API_URL}/search`, {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                words: words
            })
        });

        if (response.ok) {
            console.log("here i am")
            window.location.href = "/";
        }
    }


    return (
        <nav>
            <ul>
                <li className="logo-container">
                    <Link to="/" className="logo">
                    <img className="img1" src={logo} alt="Fix my Street Logo"/>
                    <h2 className="sitename">Fix my Street</h2>
                    </Link>
                </li>
                <li className="search-container">
                    <div className="formulaire">
                        <form className="form-control" onSubmit={onSubmit}>
                            <input
                                type="search"
                                placeholder="search"
                                id="search"
                                onChange={(e) => setWords(e.target.value)}
                                required
                            />
                            <input type="submit" value="Seach"/>
                        </form>
                    </div>
                </li>
                <li className="username-container">
                    <Link to={user?.username ? "/account" : "/account/login"}>
                        {user?.username || "Log in"}
                    </Link>
                </li>
            </ul>
        </nav> 
    );
}
export default Header