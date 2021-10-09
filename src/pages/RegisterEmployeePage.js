import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import * as yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import { Container, Col, Form, Button, Spinner } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import { BASE_URL } from "../config/index";
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const api = axios.create({
  baseURL: `${BASE_URL}/employee`,
});
const schema = yup.object().shape({
  name: yup.string().required("name not empty"),
  employeeID: yup.string().required("employeeID not empty"),
  email: yup.string().required("email not empty").email("invalid format"),
  tel: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("tel not empty")
    .min(9, "telphone more 9 char"),
  password: yup
    .string()
    .required("password not empty")
    .min(8, "password more 8 char"),
});
const RegisterEmployeePage = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const cancelToken = React.useRef(null);
  const [departments, setDepartment] = React.useState([]);
  const [routePaths, setPath] = React.useState([]);
  const [pickups, setPickup] = React.useState([]);
  const [routeUse, setRouteUse] = React.useState(null);
  const [departmentUse, setDepartmentUse] = React.useState(null);
  const [pickupUse, setPickupUse] = React.useState(null);
  const MySwal = withReactContent(Swal);
  const { addToast } = useToasts();
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    try {
      if (!departmentUse) {
        MySwal.fire({
          icon: "error",
          title: "กรุณาเลือก Department ของคุณ",
          showConfirmButton: false,
          timer: 3000,
        });
      } else if (!routeUse) {
        MySwal.fire({
          icon: "error",
          title: "กรุณาเลือก เส้นทาง ของคุณ",
          showConfirmButton: false,
          timer: 3000,
        });
      } else if (!pickupUse) {
        MySwal.fire({
          icon: "error",
          title: "กรุณาเลือก จุดรับส่ง ของคุณ",
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        const pathURL = `/`;
        const resp = await api.post(pathURL, {
          name: data.name,
          email: data.email,
          tel: data.tel,
          password: data.password,
          department: departmentUse,
          pickupPoint: pickupUse,
          routeUsed: routeUse,
          employeeId: data.employeeID,
        });
        MySwal.fire({
          icon: "success",
          title: resp.data.data,
          showConfirmButton: false,
          timer: 3000,
        });
        addToast(resp.data.data, { appearance: "success" });
        history.replace("/login");
      }
    } catch (err) {
      MySwal.fire({
        icon: "error",
        title: err.response.data.error.message,
        showConfirmButton: false,
        timer: 3000,
      });
      addToast(err.response.data.error.message, { appearance: "error" });
    }
  };
  const getData = async () => {
    try {
      setLoading(true);
      const urlPath = `/information`;
      const resp = await api.get(urlPath, {
        cancelToken: cancelToken.current.token,
      });
      setDepartment(resp.data.departments);
      setPath(resp.data.routePaths);
      setPickup(resp.data.pickups);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleChangePickup = async (selectedOption) => {
    setPickupUse(selectedOption.value);
  };
  const handleChangeDepartment = async (selectedOption) => {
    setDepartmentUse(selectedOption.value);
  };
  const handleChangePath = async (selectedOption) => {
    setRouteUse(selectedOption.value);
  };
  React.useEffect(() => {
    cancelToken.current = axios.CancelToken.source();
    getData();
    return () => {
      cancelToken.current.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (loading === true) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="grow" variant="info" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center mt-5">
        <p>Try Again</p>
        <p>{error}</p>
      </div>
    );
  }
  return (
    <>
      <Container className="mt-3">
        <Col md={{ span: 6, offset: 3 }} xs={12}>
          <h1 className="display-5 text-center">สมัครสมาชิก</h1>

          <Form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              name="name"
              type="text"
              id="name"
              aria-describedby="nameFeedback"
              className={`form-control mb-1 ${errors.name ? "is-invalid" : ""}`}
              placeholder="name"
              {...register("name")}
            />
            {errors.name && (
              <>
                <div id="nameFeedback" className="invalid-feedback">
                  {errors.name.message}
                </div>
              </>
            )}

            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              name="email"
              type="email"
              id="email"
              aria-describedby="validationServerUsernameFeedback"
              className={`form-control mb-1 ${
                errors.email ? "is-invalid" : ""
              }`}
              placeholder="name@example.com"
              {...register("email")}
            />
            {errors.email && (
              <>
                <div
                  id="validationServerUsernameFeedback"
                  className="invalid-feedback"
                >
                  {errors.email.message}
                </div>
              </>
            )}
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              name="password"
              type="password"
              id="password"
              aria-describedby="passwordFeedback"
              className={`form-control mb-1 ${
                errors.password ? "is-invalid" : ""
              }`}
              placeholder="password"
              {...register("password")}
            />
            {errors.password && (
              <>
                <div id="passwordFeedback" className="invalid-feedback">
                  {errors.password.message}
                </div>
              </>
            )}
            <label htmlFor="tel" className="form-label">
              Telphone
            </label>
            <input
              name="tel"
              type="string"
              id="tel"
              aria-describedby="telFeedback"
              className={`form-control mb-1 ${errors.tel ? "is-invalid" : ""}`}
              placeholder="tel"
              {...register("tel")}
            />
            {errors.tel && (
              <>
                <div id="telFeedback" className="invalid-feedback">
                  {errors.tel.message}
                </div>
              </>
            )}
            <label htmlFor="employeeID" className="form-label">
              employee ID
            </label>
            <input
              name="employeeID"
              type="string"
              id="employeeID"
              aria-describedby="employeeIDback"
              className={`form-control mb-1 ${
                errors.employeeID ? "is-invalid" : ""
              }`}
              placeholder="employeeID"
              {...register("employeeID")}
            />
            {errors.employeeID && (
              <>
                <div id="employeeIDback" className="invalid-feedback">
                  {errors.employeeID.message}
                </div>
              </>
            )}
            <label id="route-label">Select Department</label>
            <Select onChange={handleChangeDepartment} options={departments} />
            <label id="route-label">Select routePaths</label>
            <Select onChange={handleChangePath} options={routePaths} />
            <label id="route-label">Select pickups</label>
            <Select onChange={handleChangePickup} options={pickups} />
            <div className="d-grid gap-2">
              <Button variant="primary" className="mt-2 col-auto" type="submit">
                Register
              </Button>
            </div>
          </Form>
        </Col>
      </Container>
    </>
  );
};

export default RegisterEmployeePage;
