import React, { useContext, useEffect, useState } from 'react';
import Header from '../Components/Header';
import axios from 'axios';
import { ActiveContext } from '../Context/ActiveContext';
import EditTime from '../Components/EditTime';
import EditEmployee from '../Components/EditEmployee';

function Manager() {
  const [Employees, setEmployee] = useState([]);
  const [Timesheet, setTimesheet] = useState([]);
  const [searchEmployee, setSearchEmployee] = useState('');
  const [searchTimesheet, setSearchTimesheet] = useState('')
  const { settimesheet, setEmployee_id,  setEmail, setName, authState, showEditTime, setShowEditTime, showEditEmployee, setShowEditEmployee,  setId, setDate, setClockIn, setClockOut,} = useContext(ActiveContext)

  useEffect(() => {
    const localToken = localStorage.getItem('accessToken');
    if(!localToken){
      alert('You are not authenticated')
      localStorage.clear();
      window.location.href='/signin';
      return;
    }
    const GetEmployees = async () => {
      try {
        const response = await axios.get('https://hometownclock.onrender.com/all-users', {
          headers:{
            Authorization:`Bearer ${localToken}`
          }
        });
        setEmployee(response.data);
        
      } catch (error) {
        console.error('Error fetching employees:', error);
        if(error.response.status === 401 || error.response.status === 403){
          alert('unauthorized please login')
          window.location.href = '/'
        }
      }
    };
    const GetTimesheet = async () => {
      try {
        const response = await axios.get('https://hometownclock.onrender.com/timesheet', {
          headers:{
            Authorization:`Bearer ${localToken}`
          }
        });
        setTimesheet(response.data);
      } catch (error) {
        console.error('Error Fetching timesheet', error);
      }
    };
    GetTimesheet();
    GetEmployees();
  }, [authState]);

  const filteredEmployees = Employees.filter(employee => 
    employee.fullname.toLowerCase().includes(searchEmployee.toLowerCase()) || 
    employee.email.toLowerCase().includes(searchEmployee.toLowerCase()) ||
    employee.employee_id.toString().includes(searchEmployee)
  );

  const filteredTimesheet = Timesheet.filter(entry => {
    const employeeId = entry.employee_id ? entry.employee_id.toString() : ''; // Ensure it's a string
    return employeeId.includes(searchTimesheet.toLowerCase()) || 
           entry.date.includes(searchTimesheet.toLowerCase());
  });
  
  const handleEditTimesheet = (element) =>{
    setShowEditTime(true);
    setId(element.employee_id);
    settimesheet(element.timesheet_id)
    setDate(element.date);
    setClockIn(element.clock_in);
    setClockOut(element.clock_out);
  }
const handleEditEmployee = (employee) =>{
  setShowEditEmployee(true);
  setEmployee_id(employee.employee_id);
  setName(employee.fullname);
  setEmail(employee.email)

}
  return (
    <div className="manager">
      <Header />
      <div className="recent-activity">
        <div className="activity-bar">
          <h3 className="recent-title">Recent Activity</h3>
          <input 
            className="search" 
            placeholder="Search"
            value={searchTimesheet}
            onChange={(e) => setSearchTimesheet(e.target.value)}
          />
        </div>
        <div className="form-titles">
          <p className="form-title">Employee ID</p>
          <p className="form-title">Date</p>
          <p className="form-title">Clock In</p>
          <p className="form-title">Clock Out</p>
        </div>
        <div className="scroll-list-time">
          {filteredTimesheet.map((element, index) => (
            <div onClick={()=>handleEditTimesheet(element)} className="time-list" key={index}>
              <p className="form-title">{element.employee_id}</p>
              <p className="form-title">{element.date}</p>
              <p className="form-title">{element.clock_in}</p>
              <p className="form-title">{element.clock_out}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="employee-list">
        <div className="employee-bar">
          <h3 className="recent-title">Employees</h3>
          <input 
            className="search" 
            placeholder="Search"
            value={searchEmployee}
            onChange={(e)=>setSearchEmployee(e.target.value)}
          />
        </div>
        <div className="employee-titles">
          <p className="employee-title">Last Name</p>
          <p className="employee-title">ID</p>
          <p className="employee-title">Email</p>
        </div>
        <div className="employee-scroll-list">
          {filteredEmployees.map((employee, index) => {
            const nameParts = employee.fullname.split(" ");
            const lastName = nameParts[1] || '';

            return (
              <div onClick={()=>handleEditEmployee(employee)} key={index} className="employee-title-list">
                <p className="employee-title">{lastName}</p>
                <p className="employee-title">{employee.employee_id}</p>
                <p className="employee-title-email">{employee.email}</p>
              </div>
            );
          })}
        </div>
      </div>
      {showEditTime && 
      <EditTime />
      }
      {showEditEmployee && 
      <EditEmployee />
      }
    </div>
  );
}

export default Manager;
