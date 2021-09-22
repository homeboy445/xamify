import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import AuthContext from "./AuthContext";
import Home from "./components/Home/Home";
import Register from "./components/Register/Register";
import SignIn from "./components/SignIn/SignIn";
import Menu from "./components/Menu/Menu";
import Dashboard from "./components/Dashboard/Dashboard";
import ExamForm from "./components/ExamForm/ExamForm";
import Profilepage from "./components/ProfilePage/Profilepage";
import ErrorBox from "./components/ErrorBox/ErrorBox";

const Navigation = () => {
  const Main = useContext(AuthContext);
  const HandleAuth = (accessToken, refreshToken) => {
    if (accessToken !== undefined && accessToken.length !== 0) {
      sessionStorage.setItem("student", accessToken);
      sessionStorage.setItem(
        "refresh",
        `${refreshToken}|${new Date().toISOString()}`
      );
      Main.changeAuth(true);
      window.location.href = "/dashboard";
    }
  };

  return (
    <div>
      {Main.Auth && Main.ActiveRoute !== "ExamForm" ? <Menu /> : null}
      <Switch>
        <Route
          path="/"
          exact
          render={() => {
            Main.updateActiveRoute("Home");
            return !Main.Auth ? <Home /> : <Redirect to="/dashboard" />;
          }}
        />
        <Route
          path="/register"
          render={() => {
            Main.updateActiveRoute("Register");
            return !Main.Auth ? <Register /> : <Redirect to="/dashboard" />;
          }}
        />
        <Route
          path="/signin"
          render={() => {
            Main.updateActiveRoute("SignIn");
            return !Main.Auth ? (
              <SignIn HandleAuth={HandleAuth} />
            ) : (
              <Redirect to="/dashboard" />
            );
          }}
        />
        <Route
          path="/dashboard"
          render={() => {
            Main.updateActiveRoute("Dashboard");
            return Main.Auth ? <Dashboard /> : <Redirect to="/signin" />;
          }}
        />
        <Route
          path="/exam/:id"
          render={(props) => {
            Main.updateActiveRoute("ExamForm");
            return Main.Auth ? (
              <ExamForm {...props} />
            ) : (
              <Redirect to="/signin" />
            );
          }}
        />
        <Route
          path="/profile"
          render={() => {
            return Main.Auth ? <Profilepage /> : <Redirect to="/signin" />;
          }}
        />
        <Redirect from="*" to="/" />
      </Switch>
      {Main.isError.is ? <ErrorBox /> : null}
    </div>
  );
};

export default Navigation;
