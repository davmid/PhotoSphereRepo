import React from 'react'
import './Navbar.css'
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import { exampleUsers } from '../../AssetsBase/Users';
import logo from '../../photos/IGCLONE.png';

const userId = 2;
const loggedUser = exampleUsers.find(user => user.id === userId);

const Navbar: React.FC = () => {
  return (
    <div className='navbar'>
      <img src={logo} alt="" className="logo" />

      <div className='search-box'>
        <input type='text' placeholder='Search'></input>
        <button><SearchIcon style={{ color: 'white' }}/></button>
      </div>

      <ul>
        <li>Home</li>
        <li>Account</li>
      </ul>
    <div className='userWellcoming'>
      Witaj, {loggedUser?.name}
      <div className="user-icon">
          <PersonIcon />
        </div>
    </div>
    </div>
  );
};

export default Navbar;

