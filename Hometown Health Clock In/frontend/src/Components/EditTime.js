import React, { useContext, useState } from 'react'
import { ActiveContext } from '../Context/ActiveContext'
import axios from 'axios'
import { ToastContainer, toast, Bounce } from 'react-toastify';


function EditTime() {
  const [clock_in, setClockIn] = useState('');
  const [clock_out, setClockOut] = useState('');
  const {id, timesheet_id,  date, clockIn, clockOut, setShowEditTime} = useContext(ActiveContext)

  const handleOverlayClick = (e) => {
    setShowEditTime(false);
  };

  const handleBoxClick = (e) => {
    e.stopPropagation(); // Prevents the click from reaching the overlay
  };
  const handleUpdateClockIn = async() =>{
    
    const token = localStorage.getItem('accessToken');
    try {
      const response = await axios.put('https://hometownclock.onrender.com/update-clock-in', {timesheet_id:timesheet_id, clock_in: clock_in}, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      if(response.status === 200){
        toast.success(response.data.message);
        setTimeout(()=>{
          window.location.href='/manager'

        },2000)
        return
      }
    } catch (error) {
       if (error.response) {
            // The request was made and the server responded with a status code outside the 2xx range
            toast.error(error.response.data.message || 'Failed to clock in');
          } else {
            // Other errors like network issues
            toast.error('An unexpected error occurred');
          }
    }
  }
  const handleUpdateClockOut = async() =>{
    const token = localStorage.getItem('accessToken');
    try {
      const response = await axios.put('https://hometownclock.onrender.com/update-clock-out', {timesheet_id:timesheet_id, clock_out: clock_out}, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      if(response.status === 200){
        toast.success(response.data.message);
        setTimeout(()=>{
          window.location.href='/manager'

        },2000)
        return
      }
      
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code outside the 2xx range
        toast.error(error.response.data.message || 'Failed to clock in');
        return;
      } else {
        // Other errors like network issues
        toast.error('An unexpected error occurred');
      }
    }
  }
  return (
    <div className='edit-time-overlay' onClick={handleOverlayClick}>
      <div className='edit-time-box' onClick={handleBoxClick}>
        <div className='top-layer'>
          <h3 >{id}</h3>
        </div>
        <p className='edit-time-date'>{date}</p>
        <div className='input-time'>
          <input onChange={(e)=>setClockIn(e.target.value)} placeholder={clockIn} className='register-input' />
          <button onClick={()=>handleUpdateClockIn()} className='update-time'>Update</button>
        </div>
        <div className='input-time'>
          <input onChange={(e)=>setClockOut(e.target.value)} placeholder={clockOut} className='register-input' />
          <button onClick={()=>handleUpdateClockOut()} className='update-time'>Update</button>
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
    </div>
  )
}

export default EditTime