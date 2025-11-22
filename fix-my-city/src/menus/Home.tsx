import { Link, useNavigate } from "react-router-dom"
import '../static/style.css'
import { useState, useEffect } from 'react';
import { API_URL } from '../config';

interface Incidents {
    _id?: string;
    description?: string;
    adress?: string;
    username?: string;
    goodDate?: string; 
    mine?: boolean;
}

const Home = () => {
     const navigate = useNavigate();
     const [incidents, setIncidents] = useState<Incidents[] | null>(null);
     useEffect(() => {
        fetch(`${API_URL}/`, {
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => setIncidents(data.incidents))
        .catch(error => console.error('Error:', error));
    }, []);

    const getDate =  () => {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const date = `${day}/${month}/${year}`;
        return date;
    }

    const date = getDate();

    const onClick = async(id: string) => {
        const response = await fetch(`${API_URL}/incident/${id}`, {
            method: 'GET',
            credentials: 'include'
        })

        if (response.ok) navigate(`/incident/modifie/${id}`)
        else navigate("/")
    }
    
    return (
        <section>
            <ul>
                <li>
                    <Link to="/incident"> Ajouter un incident</Link>
                </li>
                
                <li className="date">
                    <h4>Jour actuel: <label >{date}</label> </h4>
                </li>
            </ul>

            <br/>
            <Link to="/mes_declarations"> Voir mes déclarations </Link>
            <br/>
            
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Adress</th>
                        <th>Reported by</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {incidents && incidents.map((incident, index) => (
                        <tr key={index} className="table-visible">
                            <td className="table-visible">{incident.description}</td>
                            <td className="table-visible">{incident.adress}</td>
                            <td className="table-visible">{incident.username}</td>
                            <td className="table-visible">{incident.goodDate}</td>
                            <td>
                                {incident.mine && incident._id && (
                                    <a onClick={() => onClick(incident._id!)}>Modify</a>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
        </section>
    )
}

export default Home;