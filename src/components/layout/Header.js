import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={headerStyle}>
      <h1>React Apps</h1>
      <Link to="/" style={linkStyle}>
        Home
      </Link>{" "}
      |{" "}
      <Link to="/todo-app" style={linkStyle}>
        Todo App
      </Link>{" "}
      |{" "}
      <Link to="/hacker-news" style={linkStyle}>
        Hacker News
      </Link>
    </header>
  );
}

const headerStyle = {
  background: "#282c34",
  color: "#fff",
  textAlign: "center",
  padding: "3px",
};

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
};
