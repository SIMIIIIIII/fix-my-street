import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './menus/Header';
import Footer from './menus/Footer';
import Home from './menus/Home';
import Subscribe from './menus/Subscribe';
import Account from './menus/Account';
import Login from './menus/Login';
import Incident from './menus/Incident';


function App() {

  return (
    <Router>
      <Header/>

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/account" element={<Account/>} />
        <Route path="/account/login" element={<Login/>} />
        <Route path='/incident' element={<Incident/>}/>
      </Routes>
      <br/>

      <Footer/>
    </Router>
  );
}

export default App
