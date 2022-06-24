import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import QRScaner from "./pages/QRScaner";
import RegisterPage from "./pages/RegisterPage";
import RegisterEmployeePage from "./pages/RegisterEmployeePage";
import UserStoreProvider from "./context/UserContext";
import { Provider } from "react-redux";
import configureStore from "./redux/configureStore";
import PrivateRoute from "./guard/auth";
import AdminRoute from "./guard/admin";
import TransactionPage from "./pages/TransactionPage";
import EmployeeIndex from "./pages/employee/EmployeeIndex";
import CarIndex from "./pages/car/CarIndex";
import DriverIndex from "./pages/deriver/DriverIndex";
import RouteIndex from "./pages/routePath/RouteIndex";
import PointIndex from "./pages/pickPoint/PointIndex";
import QRGenaretor from "./pages/QRGenaretor";
import DepartmentIndex from "./pages/department/DepartmentIndex";
import ProfileUser from "./pages/ProfileUser";
import UploadExcel from "./pages/UploadExcel";
import CallDriver from "./pages/CallDriver";
import CallList from "./pages/CallList";
import TransactionCall from "./pages/TransactionCall";
import RoundPage from "./pages/roundPage/RoundPage";
import ConfigPage from "./pages/asConfig/ConfigPage";
import UserTransaction from "./pages/employee/UserTransaction";
import ChangePassword from "./pages/employee/ChangPassword";
import CallListWithQueue from "./pages/CallListWithQueue";
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
                <PrivateRoute exact path="/calldriver">
                  <CallDriver />
                </PrivateRoute>
                <PrivateRoute exact path="/calllist">
                  <CallList />
                </PrivateRoute>
                <PrivateRoute exact path="/call-list-with-queue">
                  <CallListWithQueue />
                </PrivateRoute>
                <Route exact path="/login">
                  <LoginPage />
                </Route>
                <PrivateRoute exact path="/">
                  <HomePage />
                </PrivateRoute>
                <AdminRoute exact path="/uploadexcel">
                  <UploadExcel />
                </AdminRoute>
                <AdminRoute exact path="/usertransaction/:id">
                  <UserTransaction />
                </AdminRoute>
                <AdminRoute exact path="/changepassword/:id">
                  <ChangePassword />
                </AdminRoute>
                <Route exact path="/register">
                  <RegisterPage />
                </Route>
                <Route exact path="/registerem">
                  <RegisterEmployeePage />
                </Route>
                <AdminRoute exact path="/employee">
                  <EmployeeIndex />
                </AdminRoute>
                <AdminRoute exact path="/car">
                  <CarIndex />
                </AdminRoute>
                <AdminRoute exact path="/driver">
                  <DriverIndex />
                </AdminRoute>
                <AdminRoute exact path="/routepath">
                  <RouteIndex />
                </AdminRoute>
                <AdminRoute exact path="/pickup">
                  <PointIndex />
                </AdminRoute>
                <AdminRoute exact path="/round">
                  <RoundPage />
                </AdminRoute>
                <AdminRoute exact path="/config">
                  <ConfigPage />
                </AdminRoute>
                <PrivateRoute exact path="/scan">
                  <QRScaner />
                </PrivateRoute>
                <PrivateRoute exact path="/profile">
                  <ProfileUser />
                </PrivateRoute>
                <AdminRoute exact path="/generator">
                  <QRGenaretor />
                </AdminRoute>
                <AdminRoute exact path="/transaction">
                  <TransactionPage />
                </AdminRoute>
                <AdminRoute exact path="/transactioncall">
                  <TransactionCall />
                </AdminRoute>
                <AdminRoute exact path="/department">
                  <DepartmentIndex />
                </AdminRoute>
              </Switch>
            </Router>
          </ToastProvider>
        </UserStoreProvider>
      </Provider>
    </>
  );
}

export default App;
