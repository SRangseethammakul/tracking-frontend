import React from "react";
import { Route, Redirect } from "react-router-dom";
export default function PrivateRoute({ children, ...rest }) {
  let isAuth = false;
  const token = JSON.parse(localStorage.getItem("token"));
  if (token) {
    isAuth = true;
  }
  if (token && Date.now() >= token.expires_in * 1000) {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    history.replace("/");
    dispatch(updateProfile(null));
  }
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuth ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
