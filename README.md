# 🚀 Employee Management Dashboard

> A modern, responsive React & GraphQL app for **managing employee records** efficiently — with seamless view toggling, detailed modals, and intuitive actions.

---

## ✨ Features

✅ **Toggle between Tile and Grid Views** — Adjust layout based on preference  

✅ **Popup Modal for Employee Details** — Clean, focused view on click  

✅ **Edit, Flag, and Delete** employees with immediate feedback  

✅ **Flagged Indicator** — Highlight employees flagged for attention  

✅ **Responsive Design** — Works seamlessly on desktop & mobile  

✅ **Material UI Integration** — Polished, accessible UI components  


---


## 🛠 Technology Stack

| Layer          | Technology             |
| -------------- | ---------------------- |
| Frontend       | React + TypeScript     |
| API Client     | Apollo Client (GraphQL)|
| UI Components  | Material UI            |
| Styling        | CSS Modules, CSS       |
| Backend API    | Apollo Server + MongoDB (separaterepo) |

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** (v16+)  

- **npm** or **yarn**  

- Access to a compatible GraphQL backend exposing employee data including the `flagged` field

### Installation

```bash


git clone https://github.com/yourusername/employee-management-dashboard.git


cd employee-management-dashboard
npm install

# or


yarn install
Configuration

Update your GraphQL endpoint URL in Apollo Client config (e.g. in src/index.tsx or where ApolloClient is instantiated):


const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // <-- Your backend URL
  cache: new InMemoryCache(),
});


Running the App
Start the dev server:


npm start
# or
yarn start

Open http://localhost:3000 in your browser.

👩‍💼 Usage
Click Toggle View button to switch between Tile and Grid layouts

Click any employee tile or row to open detailed modal

Use Edit, Flag, Delete buttons on tiles for management

Confirm deletions via modal confirmation popup

📁 Project Structure
src/
├── components/
│   ├── EmployeeDetails/        # Modal and detail view
│   ├── EmployeeGrid/           # Grid view table
│   ├── EmployeeTileView/       # Tile/card view
│   ├── HamburgerMenu/          # Navigation menu
│   └── ...
├── pages/
│   └── Dashboard.tsx           # Main dashboard page
├── types/
│   └── Employee.ts             # 
|
├── index.tsx

🔧 GraphQL Operations

Queries
employees — Fetch all employees with all fields, including flagged

Mutations
updateEmployee — Update employee fields, including flag status

deleteEmployee — Delete employee by ID
