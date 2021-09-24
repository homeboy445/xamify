import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import AuthContext from "./AuthContext";
import Navigation from "./Navigation";

const App = () => {
  const [Auth, changeAuth] = useState(
    sessionStorage.getItem("student") !== null
  );
  const [AccessToken, updateToken] = useState(null);
  const [ActiveRoute, updateActiveRoute] = useState("");
  const [userInfo, updateInfo] = useState({
    id: null,
    email: "",
    name: "Student",
    type: "",
    profile: {
      rollNo: "",
      year: {
        id: "",
        label: "YEAR",
      },
      course: {
        id: "",
        name: "Course Name",
      },
    },
  });
  const [isError, toggleErrorBox] = useState({
    is: false,
    info: "Study hard...",
  });
  const url = "https://xamify.herokuapp.com/api";

  const RefreshAccessToken = () => {
    let refCookie = sessionStorage.getItem("refresh");
    if (refCookie === null) {
      return;
    }
    refCookie = refCookie.split("|");
    let refreshToken = refCookie[0],
      t1 = new Date(),
      t2 = new Date(refCookie[1]);
    let diff = Math.floor((t1 - t2) / 60e3);
    if (diff < 10) {
      return;
    }
    axios
      .post(url + "/auth/token", {
        token: refreshToken,
      })
      .then((response) => {
        if (!Auth) {
          return;
        }
        sessionStorage.setItem("student", response.data.accessToken);
        sessionStorage.setItem("refresher", response.data.refreshToken);
        updateToken(`Bearer ${response.data.accessToken}`);
      });
  };

  useEffect(() => {
    let value = sessionStorage.getItem("student");
    if (value !== null) {
      updateToken(`Bearer ${value}`);
      if (!Auth) {
        changeAuth(true);
      }
      axios
        .get(`${url}/auth/me`, {
          headers: { Authorization: `Bearer ${value}` },
        })
        .then((response) => {
          if (response.data.type === "TEACHER") {
            sessionStorage.clear();
            changeAuth(false);
            return;
          }
          axios
            .get(`${url}/students/${response.data.id}`, {
              headers: { Authorization: `Bearer ${value}` },
            })
            .then((response) => {
              updateInfo(response.data);
            })
            .catch((err) => {});
        })
        .catch((err) => {
          RefreshAccessToken();
        });
    } else {
      if (Auth) {
        changeAuth(false);
      }
    }
  }, [Auth, AccessToken]);

  return (
    <AuthContext.Provider
      value={{
        Auth,
        changeAuth: (val) => changeAuth(val),
        userInfo,
        url,
        AccessToken,
        updateAccessToken: (token) => updateToken(token),
        RefreshAccessToken,
        ActiveRoute,
        updateActiveRoute: (route) => updateActiveRoute(route),
        isError,
        toggleErrorBox: (data) => {
          toggleErrorBox(data);
          setTimeout(
            () => toggleErrorBox({ is: false, info: "Study hard..." }),
            10000
          );
        },
      }}
    >
      <Router>
        <Navigation />
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
