import React, { useEffect, useState, useCallback } from 'react';
import Header from '../Components/Header';
import axios from 'axios'
import { ToastContainer, toast, Bounce } from 'react-toastify';


function AdminSettings() {
  const [employee_id, setEmployeeId] = useState('');
  const [fullname, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('')
  const [User, setUser] = useState('Guest');
  const [useGeneratedId, setUseGeneratedId] = useState(true); // Default to using pre-generated ID

  const generateRandomDigits = useCallback(() => {
    const digits = Math.floor(10000 + Math.random() * 90000); // Ensures a 5-digit number
    setEmployeeId(digits.toString());
  }, []);

  useEffect(() => {
    const localToken = localStorage.getItem('accessToken');
    setUser(localStorage.getItem('User'));
    if(!localToken){
      alert('You are not authenticated')
      localStorage.clear();
      window.location.href='/signin';
      return;
    }
    generateRandomDigits(); // Generate an ID when the component mounts
  // eslint-disable-next-line 
  }, [generateRandomDigits]);

  const handleIdInputChange = (e) => {
    setEmployeeId(e.target.value); // Update employee ID with user input
  };
  const handleSubmit = async() =>{
    const token = localStorage.getItem('accessToken')
    try {
      if(!employee_id || !fullname || !email){
        toast.error('please fill all fields');
        return
      }
      const response = await axios.post('https://hometownclock.onrender.com/new-user', {employee_id, fullname, email}, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      if(response.status === 200){
        toast.success(response.data.message)
        setTimeout(()=>{
          window.location.href='/manager'
        },2000)
      }
    
    } catch (error) {
      if (error.response) {
            // Known server error
            toast.error(error.response.data.message || 'An error occurred');
          } else if (error.request) {
            // Request made but no response received
            toast.error('Network error. Please try again.');
          } else {
            // Unexpected error
            toast.error('An unexpected error occurred');
          }
          return
        }
    }
    const handlePasswordChange = async() =>{
      const localToken = localStorage.getItem('accessToken');
    const adminId = localStorage.getItem('AdminId');
      try {
        const response = await axios.put('https://hometownclock.onrender.com/change-password', {adminId, newPassword}, {
          headers:{
            Authorization: `Bearer ${localToken}`
          }
        })
        if(response.status === 200){
          toast.success(response.data.message);
          localStorage.setItem('AdminId', response.data.adminId);
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('User', response.data.User);
          setTimeout(()=>{
            window.location.href='/manager'
          },2000)
        }
      } catch (error) {
        if (error.response) {
                  // Known server error
                  toast.error(error.response.data.message || 'An error occurred');
                } else if (error.request) {
                  // Request made but no response received
                  toast.error('Network error. Please try again.');
                } 
                return
      }
    }
    
    const handleLogout = ()=>{
      localStorage.clear();
      toast.success('clocked out')
      setTimeout(()=>{
        window.location.href = '/'
      }, 2000)
    }
    
    const handleAdminDelete = async () =>{
      const admin_id = localStorage.getItem('AdminId');
      const token = localStorage.getItem('accessToken');

      try {
        const response = await axios.delete('https://hometownclock.onrender.com/admin-remove', {
          headers:{
            Authorization: `Bearer ${token}`
          },
          data: {admin_id}
        })
        if(response.status === 200){
          toast.success(response.data.message);
          localStorage.clear();
          setTimeout(()=>{
            window.location.href = '/'
          },2000)
        }
      } catch (error) {
        if(error.response){
          toast.error(error.response.data.message || 'unexpected error')
          return
        }
      }
    }

  return (
    <div className='admin-settings'>
      <Header />
      <div className='identifier'>
        {User && 
        <h2> {User}</h2>
      }
      <button className='logout' onClick={()=>handleLogout()}> Logout</button>
      </div>
      <div className='password-change'>
        <h3 className='pass-title'> Password</h3>
        <div className='pass-change'>
          <input type='password' value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} className='register-input' placeholder='Enter New Password' />
          <button onClick={()=>handlePasswordChange()} className='clock-in-button'>Change Password</button>
        </div>
      </div>
      <div className='add-employees'>
        <h3 className='pass-title'> Employees</h3>
        <div className='pass-change'>
          <button className='button'>Bulk Add</button>

          <label>
            <input
              type="checkbox"
              checked={useGeneratedId}
              onChange={() => {
                setUseGeneratedId(!useGeneratedId); // Toggle between generated and custom ID
                if (!useGeneratedId) {
                  generateRandomDigits(); // Reset to a new generated ID
                }
              }}
            />
            Use Generated ID
          </label>

          <input
            className='register-input'
            placeholder='Employee ID'
            value={employee_id}
            onChange={handleIdInputChange}
            disabled={useGeneratedId} // Disable input if using pre-generated ID
          />
          <input onChange={(e)=>setFullName(e.target.value)} className='register-input' placeholder='Employee Full Name' />
          <input onChange={(e) =>setEmail(e.target.value)} className='register-input' placeholder='Employee Email' />

          <button onClick={()=>handleSubmit()} className='clock-in-button'>Add Employee</button>
        </div>
      </div>
      <div className='password-change'>
        <button onClick={()=>handleAdminDelete()} className='red'>Delete Account</button>
      </div>
         <ToastContainer
      position="bottom-center"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      transition={Bounce}
      />
    </div>
  );
}

export default AdminSettings;
