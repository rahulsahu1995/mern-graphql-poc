// src/pages/Register/constants.js

export const registerValidation = {
  username: {
    required: "Username is required",
    minLength: {
      value: 3,
      message: "Username must be at least 3 characters long",
    },
  },
  password: {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters long",
    },
  },
  role: {
    required: "Role is required",
    validate: (value) =>
      ["admin", "employee"].includes(value.toLowerCase()) ||
      'Role must be "admin" or "employee"',
  },
};
