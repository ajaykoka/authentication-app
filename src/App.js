import React, { useState } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation {
            register(email: "${email}", password: "${password}") {
              user {
                id
                email
                isTwoFactorEnabled
              }
              token
            }
          }
        `,
      }),
    });

    const { data } = await response.json();

    if (data && data.register) {
      const { user, token } = data.register;
      setIsTwoFactorEnabled(user.isTwoFactorEnabled);
      setLoggedIn(true);
      // Store the token in local storage or session storage as needed
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation {
            login(email: "${email}", password: "${password}") {
              user {
                id
                email
                isTwoFactorEnabled
              }
              token
            }
          }
        `,
      }),
    });

    const { data } = await response.json();

    if (data && data.login) {
      const { user, token } = data.login;
      setIsTwoFactorEnabled(user.isTwoFactorEnabled);
      setLoggedIn(true);
      // Store the token in local storage or session storage as needed
    }
  };

  const handleEnableTwoFactorAuth = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation {
            enableTwoFactorAuth(userId: "USER_ID") // Replace with the actual user ID
          }
        `,
      }),
    });

    const { data } = await response.json();

    if (data && data.enableTwoFactorAuth) {
      setIsTwoFactorEnabled(true);
    }
  };

  const handleDisableTwoFactorAuth = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation {
            disableTwoFactorAuth(userId: "USER_ID") // Replace with the actual user ID
          }
        `,
      }),
    });

    const { data } = await response.json();

    if (data && data.disableTwoFactorAuth) {
      setIsTwoFactorEnabled(false);
    }
  };

  const handleVerifyTwoFactorAuth = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation {
            verifyTwoFactorAuth(userId: "USER_ID", code: "${code}") // Replace with the actual user ID and provided code
          }
        `,
      }),
    });

    const { data } = await response.json();

    if (data && data.verifyTwoFactorAuth) {
      // Handle successful verification
    } else {
      // Handle failed verification
    }
  };

  if (loggedIn) {
    if (isTwoFactorEnabled) {
      return (
        <div>
          <h1>Two-Factor Authentication Enabled</h1>
          <p>Enter the authentication code from your device:</p>
          <form onSubmit={handleVerifyTwoFactorAuth}>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button type="submit">Verify</button>
          </form>
          <button onClick={handleDisableTwoFactorAuth}>
            Disable Two-Factor Authentication
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Login Successful</h1>
          <p>Two-Factor Authentication is not enabled.</p>
          <button onClick={handleEnableTwoFactorAuth}>
            Enable Two-Factor Authentication
          </button>
        </div>
      );
    }
  } else {
    return (
      <div>
        <h1>Authentication App</h1>
        <form onSubmit={handleRegister}>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <button type="submit">Register</button>
        </form>
        <br />
        <form onSubmit={handleLogin}>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}

export default App;
