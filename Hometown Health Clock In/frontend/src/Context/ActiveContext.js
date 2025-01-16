import {createContext, useState} from 'react';

export const ActiveContext = createContext();

export const ActiveProvider = ({children}) =>{
  const [activeButton, setActiveButton] = useState('time');
  const [authState, setAuthState] = useState('')
  const [showEditTime, setShowEditTime] = useState(false);
  const [showEditEmployee, setShowEditEmployee] = useState(false);
  const [id, setId] = useState('');
  const [timesheet_id, settimesheet] = useState('')
  const [date, setDate] = useState('');
  const [clockIn, setClockIn] = useState('')
  const [clockOut, setClockOut] = useState('')
  const [employeeiD, setEmployee_id] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('')
return(
  <ActiveContext.Provider value={{timesheet_id, settimesheet,employeeiD, setEmployee_id, email, setEmail, name, setName, activeButton, showEditEmployee, setShowEditEmployee, id, setId, date,setDate, clockIn,setClockIn, clockOut, setClockOut, setActiveButton, authState, setAuthState, showEditTime, setShowEditTime}}>
{children}
  </ActiveContext.Provider>
)
}
