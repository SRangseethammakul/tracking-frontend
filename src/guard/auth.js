import React from "react";
import { Route, Redirect,useHistory } from "react-router-dom";
import { updateProfile } from "../redux/actions/authAction";
import { useDispatch } from "react-redux";
export default function PrivateRoute({ children, ...rest }) {
  let isAuth = false;
  const token = JSON.parse(localStorage.getItem("token"));
  const history = useHistory();
  const dispatch = useDispatch();
  if (token) {
    isAuth = true;
  }
  if (token && Date.now() >= token.expires_in * 1000) {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    history.replace("/login");
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
