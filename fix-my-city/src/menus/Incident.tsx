import { Link } from 'react-router-dom';
import '../static/style.css'
import { useState, useEffect } from 'react';
import { API_URL } from '../config';

interface Incident {
    _id: string,
    userId: string,
    description: string,
    adress: string
}

const Incident = () => {
    const [incident, setIncident] = useState<Incident | null>(null);
    const [adress, setAdress] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [modify, setModify] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isChecking, setIsChecking] = useState<boolean>(true);

    useEffect(() => {
        fetch(`${API_URL}/incident`, {
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.user != null) {
                setModify(data.modify);
                if (modify){
                    setIncident(data.incident);
                    setAdress(incident?.adress || "");
                    setDescription(incident?.description || "");
                }
                setIsChecking(false);
            }
            else window.location.href = '/account/login';
        })
        .catch(error => console.error('Error:', error));
    }, []);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/incident/create` , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    description: description,
                    adress: adress,
                    id: incident?._id || null
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

    if (isChecking) {
        return (
            <section>
                <div className="left-box">
                    <p>Loading...</p>
                </div>
            </section>
        );
    }

    return(
        <section>
            <div className="left-box">
                <h2>{modify ? "Modify the incident" : "Add a new incident"}</h2>
                <form onSubmit={onSubmit}>
                    <p>Description </p>
                    <textarea 
                        className="big-box"
                        id="description"
                        placeholder='description'
                        onChange={(e) => setDescription(e.target.value)}
                    >
                        {description}
                    </textarea>

                    <p>Adresse</p>
                    <textarea 
                        className="small-box" 
                        id="adress" 
                        placeholder='adress'
                        onChange={(e) => setAdress(e.target.value)}
                    >
                        {adress}
                    </textarea>
                    <br/>

                    {errorMessage && <p className='erreur'> {errorMessage} </p>}
                    <br/>
                    
                    <input 
                        className="soumettre-button"
                        type="submit"
                        value={modify ? "Modify" : "Create"}
                        disabled = {isLoading}
                    />
                </form>
                <br/>

                { modify && <Link to={`/incidentdelete/${incident?._id}`}> Delete the incident </Link> }
                
            </div>
        </section>
    )
}

export default Incident;