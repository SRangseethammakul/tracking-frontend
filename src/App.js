import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import QRScaner from "./pages/QRScaner";
import RegisterPage from "./pages/RegisterPage";
import UserStoreProvider from "./context/UserContext";
import { Provider } from "react-redux";
import configureStore from "./redux/configureStore";
import PrivateRoute from "./guard/auth";
import AdminRoute from "./guard/admin";
const { store } = configureStore();
function App() {
  return (
    <>
      <Provider store={store}>
        <UserStoreProvider>
          <ToastProvider
            placement="top-right"
            autoDismiss
            autoDismissTimeout={3 * 1000}
          >
            <Router>
              <NavBar />
              <Switch>
                <Route exact path="/">
                  <HomePage />
                </Route>
                <Route exact path="/login">
                  <LoginPage />
                </Route>
                <Route exact path="/register">
                  <RegisterPage />
                </Route>
                <Route exact path="/scan">
                  <QRScaner />
                </Route>
              </Switch>
            </Router>
          </ToastProvider>
        </UserStoreProvider>
      </Provider>
    </>
  );
}

export default App;
