CREATE DATABASE timesheet; 
CREATE TABLE admin(
  admin_id SERIAL PRIMARY KEY,
  fullname VARCHAR(255),
  email VARCHAR(255),
  password VARCHAR(255),
  company VARCHAR(255),
  zip VARCHAR(255)
);
  CREATE TABLE employee(
    employee_id INTEGER,
    fullname VARCHAR(255),
    email VARCHAR(255)
  );
CREATE TABLE clockinout(
  timesheet_id SERIAL PRIMARY KEY, 
  employee_id INTEGER, 
  date VARCHAR(255),
  clock_in VARCHAR(255),
  clock_out VARCHAR(255)
);