import React from "react";
import { Route, Redirect } from "react-router-dom";
import jwt from "jsonwebtoken";
export default function PrivateRoute({ children, ...rest }) {
  let isAuth = false;
  const token = JSON.parse(localStorage.getItem("token"));
  const decode1 = jwt.decode(token.access_token);
  if (token && decode1.role === 'admin') {
    isAuth = true;
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
              pathname: "/",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
