import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import * as yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Container, Col, Form, Button } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import { BASE_URL } from "../config/index";

const schema = yup.object().shape({
  email: yup.string().required("email not empty").email("invalid format"),
  password: yup
    .string()
    .required("password not empty")
    .min(8, "password more 8 char"),
});
const RegisterPage = () => {
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
      const pathURL = `${BASE_URL}/users/register`;
      const resp = await axios.post(pathURL, {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      MySwal.fire({
        icon: "success",
        title: resp.data.message,
        showConfirmButton: false,
        timer: 3000,
      });
      addToast(resp.data.message, { appearance: "success" });
      history.replace("/login");
    } catch (error) {
      addToast(error.response.data.error.message, { appearance: "error" });
    }
  };
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

export default RegisterPage;
