import React from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import { updateProfile } from "../redux/actions/authAction";
import { useDispatch } from "react-redux";
import jwt from "jsonwebtoken";
export default function PrivateRoute({ children, ...rest }) {
  let isAuth = false;
  const token = JSON.parse(localStorage.getItem("token"));
  const history = useHistory();
  const dispatch = useDispatch();
  const decode1 = token ? jwt.decode(token.access_token) : null;
  if (token && decode1.role === "admin") {
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
              pathname: "/",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
