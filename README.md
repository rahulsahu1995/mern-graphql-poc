# 🚀 MERN GraphQL Employee Dashboard

A modern, responsive React & GraphQL app for **managing employee records** efficiently — with seamless toggle between **Tile** and **Grid** views, detailed modals, and intuitive **CRUD** operations backed by Apollo Server and MongoDB.

---

## ✨ Features

- 🔁 Toggle between **Tile View** and **Grid View** on the frontend  
- 📋 Employee detail modals with **Edit**, **Flag/Unflag**, **Delete**, and **Add New Employee** functionality  
- 🔐 **Authentication** — Login & Register with role-based access control and JWT token storage  
- ✅ **Form validation** using `react-hook-form` with reusable validation rules from constants files  
- 📦 GraphQL API with efficient queries and mutations for employee data  
- Data persistence using **MongoDB**  
- Professional UI components powered by **Material UI**  
- Full **TypeScript** support on the frontend  
- Robust error handling and user feedback using **Snackbars**  
- Pagination and sorting support in Grid View (via MUI DataGrid)  
- Floating **Add Employee** button with popup form  
- Flagged state toggling for employees reflected instantly on UI  

---

## 🛠 Technology Stack

| Layer         | Technology               |
|---------------|--------------------------|
| Frontend      | React + TypeScript       |
| API Client    | Apollo Client (GraphQL)  |
| UI Components | Material UI              |
| Styling       | CSS Modules + CSS        |
| Form Handling | react-hook-form          |
| Backend       | Node.js + Apollo Server  |
| Database      | MongoDB                  |
| Schema & Types| GraphQL (SDL schema)     |
| Authentication| JWT                      |

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v16+  
- npm or yarn  
- MongoDB installed and running locally or remotely  

---

### Frontend Setup

1. Clone and install dependencies:

   ```bash

   git clone https://github.com/yourusername/mern-graphql-dashboard.git
   cd mern-graphql-dashboard/react-assignment-app

   npm install
   # or
   yarn install

Install additional dependencies for form validation and auth:


npm install react-hook-form
# Optional if using schema validation
npm install @hookform/resolvers yup

Configure Apollo Client URI in src/index.tsx (or your Apollo setup file):


import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // Backend GraphQL API URL
  cache: new InMemoryCache(),
  headers: {
    authorization: `Bearer ${localStorage.getItem('token') || ''}`,
  },
});

Run the frontend:

npm start
# or
yarn start

Open http://localhost:3000 in your browser.


Backend Setup
Navigate to backend folder and install dependencies:

cd ../node-apis
npm install

Create a .env file with your MongoDB connection string and server port:

MONGODB_URI=mongodb://localhost:27017/your-db-name
PORT=4000
JWT_SECRET=your_secret_key_here


Run backend server:

npm run dev
# or
node index.js

Your Apollo GraphQL server will be running at http://localhost:4000/graphql.

📜 Backend GraphQL Schema
 
type Employee {
  id: ID!
  name: String!
  age: Int!
  class: String!
  subjects: [String!]!
  attendance: Float!
  flagged: Boolean!
}

type Query {
  employees(page: Int, limit: Int, sortBy: String): [Employee!]!
  employee(id: ID!): Employee
}

type Mutation {
  addEmployee(
    name: String!
    age: Int!
    class: String!
    subjects: [String!]!
    attendance: Float!
    flagged: Boolean
  ): Employee!

  updateEmployee(
    id: ID!
    name: String
    age: Int
    class: String
    subjects: [String]
    attendance: Float
    flagged: Boolean
  ): Employee!

  deleteEmployee(id: ID!): String!

  # Authentication mutations:
  register(username: String!, password: String!, role: String!): AuthPayload!
  login(username: String!, password: String!): AuthPayload!
}

type AuthPayload {
  token: String!
  role: String!
}


🔒 Authentication Details
The backend uses JWT tokens for authentication.

Upon successful login or registration, a token is returned and stored in localStorage.

This token is sent in the Authorization header for protected GraphQL operations.

Frontend components restrict access based on user role (admin, employee).

🗂 Project Structure

Frontend (/react-assignment-app)

src/
├── components/
│   ├── EmployeeDetails/
│   ├── EmployeeGrid/
│   ├── EmployeeTileView/
│   ├── HamburgerMenu/
│   └── ...
├── pages/
│   ├── Dashboard.tsx
│   ├── Login/
│   │   ├── Login.tsx
│   │   └── constants.ts
│   └── Register/
│       ├── Register.tsx
│       └── constants.ts
├── types/
│   └── Employee.ts
└── index.tsx



Backend (/node-apis)
src/
├── schema/
│   └── typeDefs.js          # GraphQL schema definitions
├── resolvers/
│   └── index.js             # GraphQL resolvers
├── models/
│   ├── User.js              # User mongoose schema
│   └── Employee.js          # Employee mongoose schema
├── utils/
│   └── auth.js              # Auth helpers (JWT verification, hashing)
├── index.js                 # Server entry point
├── config.js                # DB connection configs
└── ...


🚀 Usage
Frontend

Use Toggle View button to switch between Tile and Grid views.

Click an employee tile or row to open detail modal.

Edit employee details or flag/unflag employees (flag status updates instantly).

Delete employees with confirmation dialog.

Add new employees via floating Add button and modal form.

Register new users or login with existing credentials.

Role-based UI control for admins and employees.


Backend

Provides GraphQL queries to fetch employees with pagination and sorting.

Supports mutations to add, update (including flag toggle), and delete employees.

Supports user registration and login returning JWT tokens.

Uses MongoDB for persistent storage.

JWT protects secured operations; clients must send tokens.