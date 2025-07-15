const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Employee {
    id: ID!
    name: String!
    age: Int!
    class: String
    subjects: [String!]!
    attendance: Float
    flagged: Boolean
  }

  type User {
    id: ID!
    username: String!
    role: String!
    token: String!
  }

  type Query {
    employees: [Employee!]!
    employee(id: ID!): Employee
  }

  type Mutation {
    register(username: String!, password: String!, role: String!): User!
    login(username: String!, password: String!): User!

    addEmployee(
      name: String!
      age: Int!
      class: String
      subjects: [String!]!
      attendance: Float
      flagged: Boolean
    ): Employee!

    updateEmployee(
      id: ID!
      name: String
      age: Int
      class: String
      subjects: [String!]
      attendance: Float
      flagged: Boolean
    ): Employee!

    deleteEmployee(id: ID!): String!
  }
`;

module.exports = typeDefs;
