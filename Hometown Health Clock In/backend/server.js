require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./bg')
const moment = require('moment-timezone')
const app = express();
const authenticateJWT = require('./authenticateJWT');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
app.use(cors());
app.use(express.json());

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	service:'gmail',
// if you are using gmail this is how it should look
  host: "smtp.gmail.com",
  port: 465,
//this secure ensures that the email is encrypted
  secure: true,
  auth: {
//replace the values with your values in .env file
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const sendEmail = async (email) => {
  try {

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: email, // Receiver address
      subject: 'Welcome to Time-Sheet Manager', // Subject
      text: 'Thank you for registering!', // Plain text body
      html: '<p>Thank you for registering! We’re excited to have you on board.</p>', // HTML body
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error('Error sending email');
  }
};

const sendUserEmail = async (email) => {
  try {

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: email, // Receiver address
      subject: 'Added to Time-Sheet Manager', // Subject
      text: 'Thank you for registering!', // Plain text body
      html: '<p>You have been added to Time-Sheet Manager</p>', // HTML body
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error('Error sending email');
  }
};
app.post('/register', async(req,res) =>{
  try {
    const {fullname, email, password, company, zip} = req.body;
    if(!fullname || !email || !password ||!company ||!zip){
      return res.status(400).json({message:'please fill all fields'})
    }
    const userExists = await pool.query('SELECT*FROM admin WHERE email = $1', [email]);
    if(userExists.rows.length > 0){
      return res.status(400).json({message:'Email already registered'})
    }
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    const newAdmin = await pool.query('INSERT INTO admin (fullname, email, password, company, zip) VALUES($1,$2,$3,$4,$5) RETURNING *', [fullname, email, hashedPassword, company, zip]);
    const adminId = newAdmin.rows[0].admin_id;
    const User = newAdmin.rows[0].fullname;
    const createaccesstoken = () =>{
      return jwt.sign({adminId}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '2d'
      })
    };
    const accessToken = createaccesstoken();
    sendEmail(email)
    return res.status(200).json({message:'Successfully Created User', accessToken,User, adminId})
  } catch (error) {
    return res.status(400).json({message:error.message})
  }
})
app.post('/login-admin', async(req,res) =>{
  try {
    const {email, password} = req.body;
    if(!email || !password){
      return res.status(500).json({message:'please fill all fields'});
    }
    const emailexist = await pool.query('SELECT*FROM admin WHERE email = $1', [email]);
    if(emailexist.rows.length === 0){
      return res.status(500).json({message:'Email does not registered'});
    }
    const admin = emailexist.rows[0];
    const validPassword = await bcrypt.compare(password, admin.password);
    if(!validPassword){
      return res.status(500).json({message:'incorrect password'})
    }
    const adminId = admin.admin_id
    const User = admin.fullname
    const createaccesstoken = () =>{
      return jwt.sign({adminId}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '2d'
      })
    };
    const accessToken = createaccesstoken();
    return res.status(200).json({message:'Logged In', accessToken, User, adminId})
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:error.message})
  }
})
app.post('/new-user', authenticateJWT, async (req, res) => {
  try {
    const { employee_id, fullname, email } = req.body;

    // Check if the employee ID already exists
    const exists = await pool.query('SELECT * FROM employee WHERE employee_id = $1', [employee_id]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ message: 'That ID already exists' });
    }

    // Insert the new user into the database
    const newUser = await pool.query(
      'INSERT INTO employee (employee_id, fullname, email) VALUES($1, $2, $3) RETURNING *',
      [employee_id, fullname, email]
    );
    sendUserEmail(email)
    return res.status(200).json({message:'sucessfully created user'})
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Server error' });
  }
});
app.get('/all-users', authenticateJWT, async(req,res) =>{
  try {

    const users = await pool.query('SELECT * FROM employee');
    if(users.rows.length <= 0){
      return res.status(200).json({message:'no data'})
    }
    res.json(users.rows)
  } catch (error) {
    console.log(error)
  }
})
app.post('/clock-in',  async (req, res) => {
  try {
    const { employee_id} = req.body;

    const exist = await pool.query('SELECT * FROM employee WHERE employee_id = $1', [employee_id]);
    if (exist.rows.length === 0) {
      return res.status(400).json({ message: 'ID does not exist' });
    }
    const currentDate = moment().tz('America/New_York').format('MM/DD/YYYY');
     const currentTime = moment().tz('America/New_York').format('hh:mm A');

    const clockOut = '-';
    // Check if there are incomplete clock-outs for the employee
    const existingClockIn = await pool.query(
      'SELECT * FROM clockinout WHERE employee_id = $1 AND clock_out = $2',
      [employee_id, '-']
    );

    if (existingClockIn.rows.length > 0) {
      return res.status(400).json({
        error: 'Cannot clock in. There is an incomplete clock-out for this employee.'
      });
    }

    // Insert the clock-in record
    const newClockIn = await pool.query(
      'INSERT INTO clockinout (employee_id, date, clock_in, clock_out) VALUES ($1, $2, $3, $4) RETURNING *',
      [employee_id, currentDate, currentTime, clockOut]
    );

    res.status(200).json({message:'successfully clocked in'});
  } catch (error) {
    console.error('Error clocking in:', error);
    res.status(400).json({ error: 'Internal server error' });
  }
});

app.put('/clock-out', async (req, res) => {
  try {
    const { employee_id } = req.body;

    const exist = await pool.query('SELECT * FROM employee WHERE employee_id = $1', [employee_id]);
    if (exist.rows.length === 0) {
      return res.status(400).json({ message: 'ID does not exist' });
    }

    const currentDate = moment().tz('America/New_York').format('MM/DD/YYYY');
    const currentTime = moment().tz('America/New_York').format('hh:mm A');

    // Check if the user is clocked in
    const userDidClockIn = await pool.query(
      'SELECT * FROM clockinout WHERE employee_id = $1 AND date = $2 AND clock_out = $3',
      [employee_id, currentDate, '-']
    );

    if (userDidClockIn.rows.length === 0) {
      return res.status(400).json({ message: 'No clock-in record found for today.' });
    }

    const timesheetId = userDidClockIn.rows[0].timesheet_id;

    // Update clock-out time
    await pool.query(
      'UPDATE clockinout SET clock_out = $1 WHERE timesheet_id = $2',
      [currentTime, timesheetId]
    );

    res.status(200).json({ message: 'Clock-out time recorded successfully.' });
  } catch (error) {
    console.error('Error clocking out:', error);
    res.status(400).json({ error: 'Internal server error' });
  }
});
app.get('/timesheet', authenticateJWT, async(req,res) =>{
  try {
    const timesheet = await pool.query('SELECT * FROM clockinout');
    res.json(timesheet.rows)
  } catch (error) {
    console.log(error)
  }
})
app.put('/change-password', authenticateJWT, async(req,res) =>{
  try {
    const {adminId, newPassword} = req.body;
    if(!adminId || !newPassword){
      return res.status(400).json({message:'fill all fields'})
    }
    const adminExists = await pool.query('SELECT*FROM admin WHERE admin_id = $1', [adminId]);
    if(adminExists.rows.length === 0){
      return res.status(400).json({message:'user was not found'})
    }
    const salt = 10;
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    const updatePassword = await pool.query('UPDATE admin SET password = $1 WHERE admin_id = $2 RETURNING *', [hashedPassword, adminId])
    const User = updatePassword.rows[0].fullname
    const createaccesstoken = () =>{
      return jwt.sign({adminId}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '2d'
      })
    };
    const accessToken = createaccesstoken();
    res.status(200).json({message:'updated password', accessToken, User, adminId})
  } catch (error) {
    return res.status(400).json({message:error.message})
  }
})
app.put('/update-clock-in', authenticateJWT, async(req,res)=>{
  try {
    const {timesheet_id, clock_in} = req.body;
    if(!timesheet_id || !clock_in){
      return res.status(400).json({message:'please fill fields'});
    }
    const newTime = await pool.query('UPDATE clockinout SET clock_in =$1 WHERE timesheet_id = $2 ', [clock_in, timesheet_id]);
    return res.status(200).json({message:'sucessfully updated'})
  } catch (error) {
    console.log(error)
    return res.status(400).json({message:error.message})
  }
})
app.put('/update-clock-out', authenticateJWT, async(req,res)=>{
  try {
    const {timesheet_id, clock_out} = req.body;
    if(!timesheet_id || !clock_out){
      return res.status(400).json({message:'please fill fields'});
    }
    const newTime = await pool.query('UPDATE  clockinout SET clock_out =$1 WHERE timesheet_id = $2 ', [clock_out, timesheet_id]);
    return res.status(200).json({message:'sucessfully updated'})
  } catch (error) {
    console.log(error)
    return res.status(400).json({message:error.message})
  }
})
app.put('/update-employee-name', authenticateJWT, async(req,res) =>{
  try {
    const {employee_id, fullname} = req.body;
    if(!employee_id || !fullname){
      return res.status(400).json({message:'please fill all fields'});
    }
    const employeeExists = await pool.query('SELECT * FROM employee WHERE employee_id = $1', [employee_id]);
    if(employeeExists.rows.length === 0){
      return res.status(400).json({message:'employee does not exist'})
    }
    const newName = await pool.query('UPDATE employee SET fullname = $1 WHERE employee_id = $2', [fullname, employee_id] );
    return res.status(200).json({message:'successfully updated name'})
  } catch (error) {
    console.log(error)
    return res.status(400).json({message:error.message})
  }
})
app.put('/update-employee-email', authenticateJWT, async(req,res)=>{
  try {
    const {employee_id, newEmail} = req.body;
    if(!employee_id || !newEmail){
      return res.status(400).json({message:'please fill all fields'});
    }
    const employeeExists = await pool.query('SELECT * FROM employee WHERE employee_id = $1', [employee_id]);
    if(employeeExists.rows.length === 0){
      return res.status(400).json({message:'employee does not exist'})
    }
    const newupdateEmail = await pool.query('UPDATE employee SET email = $1 WHERE employee_id = $2', [newEmail, employee_id])
    return res.status(200).json({message:'sucessfully updated email'})
  } catch (error) {
    console.log(error)
    return res.status(400).json({message:error.message})
  }
})
app.delete('/remove-user', authenticateJWT, async(req,res)=>{
  try {
    const {employee_id} = req.body;
  
    const exists = await pool.query('SELECT*FROM employee WHERE employee_id = $1', [employee_id]);
    if(exists.rows.length === 0){
      return res.status(400).json({message:'employee does not exist'})
    }
    const removeUser = await pool.query('DELETE FROM employee WHERE employee_id = $1', [employee_id]);
    return res.status(200).json({message:'succesfully deleted user'});
  } catch (error) {
    return res.status(400).json({message:error.message})
  }
})

app.delete('/admin-remove', authenticateJWT, async(req,res)=>{
  try {
    const {admin_id} = req.body;
    if(!admin_id){
      return res.status(400).json({message:'please fill all fields'});
    }
    const exists = await pool.query("SELECT * FROM admin WHERE admin_id = $1", [admin_id]);
    if(exists.rows.length === 0){
      return res.status(400).json({message:'user does not exist'})
    }
    const deleteUser = await pool.query('DELETE FROM admin WHERE admin_id = $1', [admin_id]);
    return res.status(200).json({message:'successfully deleted user'})
  } catch (error) {
    console.log(error);
    return res.status(400).json({message:error.message})
  }
})

app.listen(3500, () =>{
  console.log('listening to server')
})