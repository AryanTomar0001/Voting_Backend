# 🗳️ Voting Application – Backend

A backend application for a secure voting system where users can register, log in, and vote for candidates.  
The system supports role-based access control, allowing **admins to manage candidates** and **users to vote only once**.

---

## 🚀 Features

- User registration and login using **Aadhar Card Number and password**
- JWT-based authentication and authorization
- Users can:
  - View all candidates
  - Vote only once
- Admins can:
  - Add new candidates
  - Update candidate details
  - Delete candidates
- Admins are **not allowed to vote**
- Secure password hashing using **bcrypt**
- Vote counting and result listing

---

## 🛠️ Technologies Used

- Node.js  
- Express.js  
- MongoDB & Mongoose  
- JSON Web Tokens (JWT)  
- bcrypt  
- dotenv  

---

## 📌 API Endpoints

### 🔐 Authentication

### **Sign Up**  
POST /signup

Register a new user.

### **Login**  
POST /login

Login user and receive JWT token.

---

### 👤 User

### **Get Profile**  
GET /users/profile

Get logged-in user profile (JWT required).

### **Change Password**  


PUT /users/profile/password

Update user password (JWT required).

---

### 🧑‍💼 Candidates

### **Get All Candidates**  


GET /candidates

Get list of all candidates.

### **Add Candidate (Admin only)**  


POST /candidates


### **Update Candidate (Admin only)**  


PUT /candidates/:id


### **Delete Candidate (Admin only)**  


DELETE /candidates/:id


---

### 🗳️ Voting

### **Vote for Candidate (User only)**  


POST /candidates/vote/:id


### **Get Vote Count**  


GET /candidates/vote/count

Returns vote count of all candidates (sorted by highest votes).

---

## ⚙️ Setup Instructions

1. Clone the repository  
2. Install dependencies  
   ```bash
   npm install


Create a .env file in the root folder

PORT=3000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key


Start the server

npm run dev


or

node index.js

---
### 🔐 Security Notes

Passwords are encrypted using bcrypt before storing in the database

JWT is used to protect private routes

.env file is excluded from GitHub using .gitignore

---
### 📌 Project Status

This project is built as a backend system for learning and demonstrating:

Authentication & authorization

REST API design

MongoDB schema design

Secure voting logic

---
### 👨‍💻 Author

Aryan Tomar
MCA (AI & ML) – Backend & AI/ML Developer Aspirant
