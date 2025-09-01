import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/userinfo", { credentials: "include" })
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {user && <pre>{JSON.stringify(user, null, 2)}</pre>}
    </div>
  );
}
