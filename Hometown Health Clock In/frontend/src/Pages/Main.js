import React, { useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast, Bounce } from 'react-toastify';


function Main() {
 const [employee_id, setEmployeeId] = useState('');

 const handleClockIn = async () => {
  if (!employee_id) {
    toast.error('Please enter ID');
    return;
  }
  try {
    const response = await axios.post('https://hometownclock.onrender.com/clock-in', { employee_id });
    toast.success(response.data.message);
    setEmployeeId('')
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code outside the 2xx range
      toast.error(error.response.data.message || 'Failed to clock in');
    } else {
      // Other errors like network issues
      toast.error('An unexpected error occurred');
    }
  }
};

const handleClockOut = async () => {
  if (!employee_id) {
    toast.error('Please enter ID');
    return;
  }
  try {
    const response = await axios.put('https://hometownclock.onrender.com/clock-out', { employee_id });
    toast.success(response.data.message);
    setEmployeeId('')
  } catch (error) {
    if (error.response) {
      // Handle error response
      toast.error(error.response.data.message || 'Failed to clock out');
    } else {
      toast.error('An unexpected error occurred');
    }
  }
};
 
  return (
    <div className='main'>
      <h1 className='title'>Time-Sheet Manager</h1>
      <p className='info'>Enter your employee ID in the box and hit verify. You will be sent a verification link to your email. You can use that to verify your clock in. </p>
      <input onChange={(e)=>setEmployeeId(e.target.value)} value={employee_id} className='employee-id' placeholder='Enter Employee ID' />
      <button onClick={()=>handleClockIn()} className='clock-in-button'>Clock In </button>
      <button onClick={()=>handleClockOut()} className='clock-out-button'>Clock Out </button>
      <p  className='links'>Issues Clocking In</p>
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
  )
}

export default Main