const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const generateToken = (user) =>
  jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

module.exports = {
  Query: {
    employees: async () => {
      return await Employee.find();
    },
    employee: async (_, { id }) => {
      return await Employee.findById(id);
    },
  },

  Mutation: {
    register: async (_, { username, password, role }) => {
      const existingUser = await User.findOne({ username });
      if (existingUser) throw new Error("Username already exists");

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashedPassword, role });
      await user.save();

      const token = generateToken(user);
      return { id: user._id, username, role, token };
    },

    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error("Invalid username or password");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid username or password");

      const token = generateToken(user);
      return { id: user._id, username, role: user.role, token };
    },

    addEmployee: async (
      _,
      { name, age, class: className, subjects, attendance },
      { user }
    ) => {
      if (!user) throw new Error("Unauthorized");
      const employee = new Employee({
        name,
        age,
        class: className,
        subjects,
        attendance,
      });
      await employee.save();
      return employee;
    },

    updateEmployee: async (
      _,
      { id, name, age, class: className, subjects, attendance, flagged },
      { user }
    ) => {
      if (!user) throw new Error("Unauthorized");
      const employee = await Employee.findById(id);
      if (!employee) throw new Error("Employee not found");

      if (name !== undefined) employee.name = name;
      if (age !== undefined) employee.age = age;
      if (className !== undefined) employee.class = className;
      if (subjects !== undefined) employee.subjects = subjects;
      if (attendance !== undefined) employee.attendance = attendance;
      if (flagged !== undefined) employee.flagged = flagged;

      await employee.save();
      return employee;
    },

    deleteEmployee: async (_, { id }, { user }) => {
      if (!user) throw new Error("Unauthorized");
      await Employee.findByIdAndDelete(id);
      return `Employee ${id} deleted`;
    },
  },
};
