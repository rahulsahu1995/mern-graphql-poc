🚀 MERN GraphQL Dashboard
A modern, responsive React & GraphQL app for managing employee records efficiently — with seamless view toggling, detailed modals, and intuitive CRUD operations, backed by an Apollo Server and MongoDB.

✨ Features
✅ Toggle between Tile and Grid Views on the frontend

✅ Employee Detail Modals with Edit, Flag, and Delete functionality

✅ GraphQL API for efficient querying and mutations

✅ MongoDB for data persistence

✅ Material UI for professional UI components

✅ Full TypeScript support on frontend

✅ Robust error handling and user feedback with snackbars

🛠 Technology Stack
Layer Technology
Frontend React + TypeScript
API Client Apollo Client (GraphQL)
UI Components Material UI
Styling CSS Modules + CSS
Backend Node.js + Apollo Server
Database MongoDB
Schema & Types GraphQL (with SDL schema)

⚙️ Getting Started
Prerequisites
Node.js (v16+ recommended)

npm or yarn

MongoDB installed and running locally or remotely

Frontend Setup

1. Clone & Install

git clone https://github.com/yourusername/mern-graphql-dashboard.git
cd mern-graphql-dashboard/react-assignment-app

npm install

# or

yarn install

2. Configure Apollo Client
   Update the GraphQL endpoint in your Apollo Client setup (src/index.tsx or wherever ApolloClient is initialized):

const client = new ApolloClient({
uri: 'http://localhost:4000/graphql', // Backend GraphQL API URL
cache: new InMemoryCache(),
});

3. Run Frontend

npm start

# or

yarn start

Open http://localhost:3000 in your browser.

Backend Setup

1. Clone & Install

cd ../node-apis
npm install

2. Environment Configuration
   Create a .env file (if applicable) with your MongoDB connection string:

MONGODB_URI=mongodb://localhost:27017/your-db-name
PORT=4000

3. Run Backend Server

npm run dev

# or

node index.js
This starts your Apollo GraphQL server at http://localhost:4000/graphql

Backend GraphQL Schema
graphql

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
}

Usage
Frontend
Use the Toggle View button to switch between Tile and Grid views

Click on an employee to view detailed info in a modal

Edit employee details or flag/unflag employees easily

Delete employees with confirmation popup

Add new employees via floating Add button modal

Backend
Supports querying employees with pagination and sorting (if extended)

Handles employee CRUD operations via mutations

Project Structure Overview
Frontend (/frontend)

src/
├── components/
│ ├── EmployeeDetails/
│ ├── EmployeeGrid/
│ ├── EmployeeTileView/
│ ├── HamburgerMenu/
│ └── ...
├── pages/
│ └── Dashboard.tsx
├── types/
│ └── Employee.ts
└── index.tsx

Backend (/backend)
graphql

src/
├── schema/
│ └── typeDefs.js (GraphQL schema)
├── resolvers/
│ └── index.js
├── models/
|--User.js
│ └── Employee.js (Mongoose schema)
├── index.js (server entry)
├── config.js (DB connection)
└── ...

Additional Notes
Ensure MongoDB is running before starting the backend

Frontend and backend communicate over GraphQL at the specified endpoint

Customize your GraphQL schema and resolvers as needed for additional features
