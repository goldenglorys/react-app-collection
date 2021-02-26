import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import HackerNewsAPI from "./components/HackerNews/HackerNewsAPI";
import Header from "./components/layout/Header";
import TodoApp from "./components/TodoApp/TodoApp";
import Home from "./components/Home";

import "./App.css";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Router>
          <Header />
          <Route exact path="/" component={Home}></Route>
          <Route path="/todo-app" component={TodoApp}></Route>
          <Route path="/hacker-news" component={HackerNewsAPI}></Route>
          {/* <HackerNewsAPI></HackerNewsAPI> */}
          {/* <TodoApp /> */}
        </Router>
      </React.Fragment>
    );
  }
}

export default App;
