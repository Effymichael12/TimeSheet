import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActiveContext } from '../Context/ActiveContext';

function Header() {
  const { activeButton, setActiveButton } = useContext(ActiveContext);
  const navigate = useNavigate(); // Hook for navigation

  const handleButtonClick = (button, path) => {
    if(window.location.href ==='/manager'){
      setActiveButton('time')
    }
    else if(window.location.href === '/admin'){
      setActiveButton('admin')
    }
    setActiveButton(button); // Set the active button
    navigate(path);          // Navigate to the desired page
  };

  return (
    <div className='header'>
      <div className='left-side'>
        <h3 className='title-header'>Time-Sheet Manager</h3>
      </div>
      <div className='right-side'>
        <button
          className='time'
          style={{
            backgroundColor: activeButton === 'time' ? '#00D47E' : '#2B747E',
          }}
          onClick={() => handleButtonClick('time', '/manager')}
        >
          Time Sheets
        </button>
        <button
          className='admin'
          style={{
            backgroundColor: activeButton === 'admin' ? '#00D47E' : '#2B747E',
          }}
          onClick={() => handleButtonClick('admin', '/admin')}
        >
          Admin Settings
        </button>
      </div>
    </div>
  );
}

export default Header;
