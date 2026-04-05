# Study Group Organizer
**IFN636 Software Life Cycle Management — Assessment 1.2**
Student: Jin Young An | N12574422 | QUT
 
---
 
## 🌐 Public URL
**http://13.54.11.218**
 
---
 
## 🔑 Test Credentials
**Student Account:**
- Email: `student@test.com`
- Password: `Test1234!`
 
**Admin Account:**
- Email: `admin@test.com`
- Password: `Admin1234!`
 
---
 
## 📖 Project Overview
Study Group Organizer extends Assessment 1.1 design with a full implementation.
 
**User Panel (Students):** Create / Browse / Update / Delete groups, Join & Leave
**Admin Panel:** Monitor all groups, Delete inappropriate content
 
---
 
## 🛠️ Tech Stack
| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | React.js                |
| Backend    | Node.js + Express.js    |
| Database   | MongoDB Atlas           |
| Auth       | JWT                     |
| Deployment | AWS EC2 + PM2 + Nginx   |
| CI/CD      | GitHub Actions          |
 
---
 
## ⚙️ Local Setup
```bash
git clone https://github.com/Jin-young0609/study-group-organizer.git
cd study-group-organizer
 
# Backend
cd backend && npm install
# Create backend/.env with MONGO_URI, JWT_SECRET, PORT
npm start
 
# Frontend (new terminal)
cd frontend && npm install && npm start
```
 
---
 
## API Endpoints
| Method | Endpoint                    | Description        | Auth        |
|--------|-----------------------------|-------------------- |-------------|
| POST   | /api/auth/register          | Register            | No          |
| POST   | /api/auth/login             | Login               | No          |
| GET    | /api/studygroups            | Browse all groups   | Required    |
| GET    | /api/studygroups/my         | My groups           | Required    |
| POST   | /api/studygroups            | Create group        | Required    |
| PUT    | /api/studygroups/:id        | Update group        | Creator     |
| DELETE | /api/studygroups/:id        | Delete group        | Creator/Admin|
| POST   | /api/studygroups/:id/join   | Join group          | Required    |
| POST   | /api/studygroups/:id/leave  | Leave group         | Required    |
| GET    | /api/studygroups/admin/all  | All groups (admin)  | Admin only  |
 
---
 
## Branching Strategy
| Branch                       | Purpose                    |
|------------------------------|----------------------------|
| main                         | Production-ready code      |
| feature/studygroup-backend   | Backend CRUD               |
| feature/studygroup-frontend  | Frontend UI                |
 
---
 
## CI/CD
GitHub Actions → self-hosted runner on AWS EC2 (13.54.11.218)
Instance ID: i-016c213220a53ee38
