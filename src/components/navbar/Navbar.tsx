import React from 'react'
import './Navbar.css'
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import { User } from '../../types/interfaces';

const exampleUser: User = {
  name: "Jan Kowalski",
  email: "jan.kowalski@example.com",
  id: 1,
  avatarUrl: "https://example.com/avatar.jpg",
  role: "user",
  createdAt: new Date(),
};

const Navbar: React.FC = () => {
  return (
    <div className='navbar'>
      <img src='' alt='' className='logo' />
      <h1>PhotoSphere</h1>

      <div className='search-box'>
        <input type='text' placeholder='Search'></input>
        <button><SearchIcon style={{ color: 'white' }}/></button>
      </div>

      <ul>
        <li>Home</li>
        <li>Account</li>
      </ul>
    <div className='userWellcoming'>
      Witaj, {exampleUser.name}
      <div className="user-icon">
          <PersonIcon />
        </div>
    </div>
    </div>
  );
};

export default Navbar;

