import React from "react";
import "./LoginPage.css";
const LoginTextEdit = ({
  type = "text", // "text" or "password"
  placeholder = "",
  value,
  onChange,
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="login-text-edit"
    />
  );
};

export default LoginTextEdit;
