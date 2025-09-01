import React, { useEffect, useState } from "react";

function UserInfo() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8081/api/me", {
      credentials: "include", // VERY important: send cookies
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!user || !user.authenticated) {
    return (
      <div>
        <p>You are not logged 22in.</p>
        <a href="http://localhost:8081/saml2/authenticate/openam">
          <button>Login with OpenAM</button>
        </a>
      </div>
    );
  }

  return (
    <div>
      <h2>Welcome, {user.username}</h2>
      <h3>Attributes</h3>
      <ul>
        {Object.entries(user.attributes).map(([key, value]) => (
          <li key={key}>
            {key}: {value.join(", ")}
          </li>
        ))}
      </ul>

      <h3>Authorities</h3>
      <ul>
        {user.authorities.map((a, idx) => (
          <li key={idx}>{a.authority}</li>
        ))}
      </ul>

      <button
        onClick={() =>
          (window.location.href = "http://localhost:8081/logout")
        }
      >
        Logout
      </button>
    </div>
  );
}

export default UserInfo;
