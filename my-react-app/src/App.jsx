import './App.css';
import Header from './components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCoffee, faHome, faBars, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Homepage from './Homepage'; // Không cần dấu ngoặc nhọn nếu export default
import Login from './components/login/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />}/>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
