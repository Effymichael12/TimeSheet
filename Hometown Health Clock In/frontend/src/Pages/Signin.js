import React, { useContext, useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { ActiveContext } from '../Context/ActiveContext';

function Signin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {setAuthState} = useContext(ActiveContext)

  const handleSignIn = async() =>{
   try {
    if(!email ||!password){
      toast.error('please fill all fields');
      return
    }
    const response = await axios.post('https://hometownclock.onrender.com/login-admin', {email,password});
   if(response.status === 200){
      toast.success(response.data.message)
      setAuthState(response.data.accessToken)
      localStorage.setItem('accessToken',response.data.accessToken)
      localStorage.setItem('User', response.data.User);
      localStorage.setItem('AdminId', response.data.adminId);

      setTimeout(()=>{
        window.location.href='/manager'
      },2000)
      return
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
  return (
    <div className='main'>
      <h1  className='title'>Signin</h1>
      <input value={email} onChange={(e)=>setEmail(e.target.value)} className='email' placeholder='Email' />
      <input type='password' value={password} onChange={(e)=>setPassword(e.target.value)} className='email' placeholder='Password' />
      <button onClick={()=>handleSignIn()} className='clock-in-button'>Sign In </button>
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

export default Signin