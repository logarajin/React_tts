import React from "react";

export default function LoginButton() {
  const handleLogin = () => {
    // Redirects to Spring Boot backend which triggers SAML login
    window.location.href = "http://localhost:8081/api/me";
  };

  return <button onClick={handleLogin}>Login with SAML222222 (OpenAM)</button>;
}