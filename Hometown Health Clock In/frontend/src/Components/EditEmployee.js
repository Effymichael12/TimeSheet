import React, { useContext, useState } from 'react';
import axios from 'axios'
import { ActiveContext } from '../Context/ActiveContext';
import { ToastContainer, toast, Bounce } from 'react-toastify';


function EditEmployee() {
  const [fullname, setFullName] = useState('');
  const [newEmail, setNewEmail] = useState('')
  const { setShowEditEmployee, employeeiD, email, name } = useContext(ActiveContext);

  // Function to stop event propagation
  const handleOverlayClick = (e) => {
    setShowEditEmployee(false);
  };

  const handleBoxClick = (e) => {
    e.stopPropagation(); // Prevents the click from reaching the overlay
  };

  const handleSubmitName = async() =>{
    const token = localStorage.getItem('accessToken');
    try {
      const response = await axios.put('https://hometownclock.onrender.com/update-employee-name', {employee_id: employeeiD, fullname: fullname}, 
        {headers:{
          Authorization: `Bearer ${token}`
        }}
      )
      if(response.status === 200){
        toast.success(response.data.message);
        setTimeout(()=>{
          window.location.href='/manager'
        },2000)
      }
    } catch (error) {
      if(error.response){
        toast.error(error.response.data.message || 'unexpected error')
        return
      }
    }
  }

  const handleSubmitEmail = async() =>{
    const token = localStorage.getItem('accessToken');
    try {
      const response = await axios.put('https://hometownclock.onrender.com/update-employee-email', {employee_id: employeeiD, newEmail: newEmail}, 
        {headers:{
          Authorization: `Bearer ${token}`
        }}
      )
      if(response.status === 200){
        toast.success(response.data.message);
        setTimeout(()=>{
          window.location.href='/manager'
        },2000)
      }
    } catch (error) {
      if(error.response){
        toast.error(error.response.data.message || 'unexpected error')
        return
      }
    }
  }
  const handleDeleteUser = async () =>{
    const token = localStorage.getItem('accessToken');
    try {
      const response = await axios.delete('https://hometownclock.onrender.com/remove-user',{
        headers:{
          Authorization:  `Bearer ${token}`
        },
        data: { employee_id: employeeiD }
      })
      if(response.status === 200){
        toast.success(response.data.message);
        setTimeout(()=>{
          window.location.href='/manager'
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
    <div className='edit-time-overlay' onClick={handleOverlayClick}>
      <div className='edit-time-box' onClick={handleBoxClick}>
        <div className='top-layer'>
          <h3>Edit Employee</h3>
        </div>
        <p className='edit-time-date'>{employeeiD}</p>
        <div className='input-time'>
          <input onChange={(e)=>setFullName(e.target.value)} placeholder={name} className='register-input' />
          <button onClick={()=>handleSubmitName()} className='update-time'>Update</button>
        </div>
        <div className='input-time'>
          <input onClick={(e)=>setNewEmail(e.target.value)} placeholder={email} className='register-input' />
          <button onClick={(e)=>handleSubmitEmail()} className='update-time'>Update</button>
        </div>
        <button onClick={()=>handleDeleteUser()} className='remove-button'>Remove User</button>
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

export default EditEmployee;
