const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

const users = [];

// Define your GraphQL schema here
const schema = buildSchema(`
  type User {
    id: ID!
    email: String!
    password: String!
    isTwoFactorEnabled: Boolean!
  }
  
  type AuthenticationResponse {
    user: User!
    token: String!
  }
  
  type Query {
    getUser(id: ID!): User
  }
  
  type Mutation {
    register(email: String!, password: String!): AuthenticationResponse
    login(email: String!, password: String!): AuthenticationResponse
    enableTwoFactorAuth(userId: ID!): Boolean
    disableTwoFactorAuth(userId: ID!): Boolean
    verifyTwoFactorAuth(userId: ID!, code: String!): AuthenticationResponse
  }
`);

const register = ({ email, password }) => {
  const user = {
    id: String(users.length + 1),
    email,
    password,
    isTwoFactorEnabled: false,
  };
  users.push(user);

  return {
    user,
    token: generateAuthToken(user.id),
  };
};

const login = ({ email, password }) => {
  const user = users.find((user) => user.email === email && user.password === password);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  return {
    user,
    token: generateAuthToken(user.id),
  };
};

const enableTwoFactorAuth = ({ userId }) => {
  const user = users.find((user) => user.id === userId);

  if (!user) {
    throw new Error('User not found');
  }

  user.isTwoFactorEnabled = true;

  return true;
};

const disableTwoFactorAuth = ({ userId }) => {
  const user = users.find((user) => user.id === userId);

  if (!user) {
    throw new Error('User not found');
  }

  user.isTwoFactorEnabled = false;

  return true;
};

const verifyTwoFactorAuth = ({ userId, code }) => {
  const user = users.find((user) => user.id === userId);

  if (!user) {
    throw new Error('User not found');
  }

  if (!user.isTwoFactorEnabled) {
    throw new Error('Two-factor authentication is not enabled for this user');
  }

  // Implement your code verification logic here
  const isCodeValid = verifyCode(code); // Replace with your code verification implementation

  if (!isCodeValid) {
    throw new Error('Invalid authentication code');
  }

  return {
    user,
    token: generateAuthToken(user.id),
  };
};

const generateAuthToken = (userId) => {
    const secret = process.env.SECRET_KEY; // Read the secret key from the environment variable
    const token = jwt.sign({ userId }, secret, { expiresIn: '1h' });
    return token;
  };
  
// Define your root resolver
const root = {
  register,
  login,
  enableTwoFactorAuth,
  disableTwoFactorAuth,
  verifyTwoFactorAuth,
};

app.use(cors());
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

const port = 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get('/', (req, res) => {
  // Replace with your desired response or frontend rendering logic
  res.send('Welcome to the API');
});

function verifyCode(code) {
  // Implement your code verification logic here
  // Return true if the code is valid, false otherwise
  // You can use a library or custom implementation to verify the code
  // For example:
  // return code === '123456'; // Replace with your code verification implementation
  // You may also consider using a time-based one-time password (TOTP) algorithm for code verification
  return true; // Placeholder, replace with your implementation
}
