import React, { useContext, useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { ActiveContext } from '../Context/ActiveContext';

function Register() {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [zip, setZip] = useState('');
  const {setAuthState} = useContext(ActiveContext)
  const handleRegister = async(e) =>{
  e.preventDefault();
   try {
    const response  = await axios.post('https://hometownclock.onrender.com/register', {fullname, email, password, company, zip});
    if(response.status === 200){
      setAuthState(response.data.accessToken);
      localStorage.setItem('accessToken',response.data.accessToken);
      toast.success(response.data.message);
      localStorage.setItem('User', response.data.User);
      localStorage.setItem('AdminId', response.data.adminId);
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
  return (
    <div className='main'>
      <h1 className='title'> Register with Time-Sheet Manager</h1>
      <p className='info'>You will be registering as an Admin for your company. You cannot replicate a registered company</p>
      <form onSubmit={handleRegister} className='form'>
      <label className='register-name'> Full Name</label>
      <input onChange={(e) =>setFullname(e.target.value)} value={fullname} className='register-input' placeholder='Enter Here'></input>
      <label className='register-name'> Email</label>
      <input onChange={(e) =>setEmail(e.target.value)} value={email} className='register-input' placeholder='Enter Here'></input>
      <label className='register-name'> Password</label>
      <input type='password' onChange={(e) =>setPassword(e.target.value)} value={password} className='register-input' placeholder='Enter Here'></input>
      <label className='register-name'> Company Adress</label>
      <input onChange={(e) =>setCompany(e.target.value)} value={company} className='register-input' placeholder='Enter Here'></input>
      <label className='register-name'> Company Zip-Code</label>
      <input onChange={(e) =>setZip(e.target.value)} value={zip} className='register-input' placeholder='Enter Here'></input>
      <button type='submit' className="clock-in-button">Register</button>
      </form>
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

export default Register