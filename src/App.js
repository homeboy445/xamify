import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Register from './components/Register/Register';
import SignIn from './components/SignIn/SignIn';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/signin">
          <SignIn />
        </Route>
      </Switch>
    </Router>
  )
}

export default App;
