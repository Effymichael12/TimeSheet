Timesheet Manager 
This purpose of this project was to create a clock in and out system for a local phramacutical company. They had employees checking in at different times and this helped managers keep track of when employees arrived and left the premises. 
This system was made with React, Node.js, PostGresql and was deployed through render. 
![image](https://github.com/user-attachments/assets/7b285014-beda-4426-b3f4-bc16a38caf3a)
This was the registration page where the admin would register. Using nodemailer we would send confirmation emails. I also used bcrypt to encrypt the password that the user input.

![image](https://github.com/user-attachments/assets/fb49f773-3035-4e37-b1dd-d01a0962de54)
This is the main management page where the users were able to change timesheets of employees and were also able to make changes to the employee information such as name and email 

![image](https://github.com/user-attachments/assets/1da9f37f-452f-4685-8104-33b7e1b51170)

Other images of the different pages and components. All requests from the manager page went through a jwt token authorization system. Without the correct token, the user would  not be able to make changes. This security feature helped ensure that no random person was able to access the backend. 
<img width="1386" alt="Screenshot 2025-01-16 at 2 24 28 PM" src="https://github.com/user-attachments/assets/cab61122-0d48-4774-9963-b1b59f9767cd" />
<img width="1386" alt="Screenshot 2025-01-16 at 2 25 14 PM" src="https://github.com/user-attachments/assets/d28b750f-5cf6-4b59-bd76-bff82745fc6d" />
<img width="1386" alt="Screenshot 2025-01-16 at 2 25 02 PM" src="https://github.com/user-attachments/assets/399afb5d-1fef-4804-9349-3db04f8dd0c8" />

How to replicate:
start of by downloading the whole file with both backend and frontend. 
You will need to begin by adding some environment variables for the backend. These are mainly related to the postgres backend database setup and the nodemailer auth. 
Identify them in the server.js and the bg.js and change them accordingly. 
If you go to the database.sql file, you will be able to get the commands to create the database structure on your local postgres. You can do so using the postgres app or the command bar (terminal in mac)
once you have completed with that, go to the frontend and change the request url. They will be directed to a render account that will not exist. You will have to replace that with your localhost and port. 
REMEMBER: keep the /request, just remove the parts before that such as onrender.com. 

Thank you! Happy Hacking!
