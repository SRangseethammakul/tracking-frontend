import React from "react";
import axios from "axios";
import { Form, Container, Col, Button } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { BASE_URL } from "../../config/index";
const api = axios.create({
  baseURL: `${BASE_URL}/userControl/forcechangepassword`,
});
const ChangePassword = () => {
  const { addToast } = useToasts();
  const { id } = useParams();
  const history = useHistory();
  const profileValue = JSON.parse(localStorage.getItem("token"));
  const onSubmit = async () => {
    const newPassword = document.getElementById("newPassword").value;
    if (!newPassword) {
      document.getElementById("newPassword").focus();
      addToast("please insert password", { appearance: "info" });
      return 0;
    }
    const resp = await api.post(
      `/${id}`,
      {
        newpassword: newPassword,
      },
      {
        headers: {
          Authorization: "Bearer " + profileValue.access_token,
        },
      }
    );
    addToast(resp.data.message, { appearance: "success" });
    history.replace("/employee");
  };
  return (
    <>
      <Container className="mt-3">
        <Col md={{ span: 6, offset: 3 }} xs={12}>
          <h1 className="display-5 text-center">Change New Password</h1>
          <Form.Label column sm="2">
            Password
          </Form.Label>
          <Form.Control
            type="password"
            id="newPassword"
            placeholder="Password"
          />
          <Button
            className="mt-3"
            variant="outline-success"
            onClick={() => {
              onSubmit();
            }}
          >
            Update Password
          </Button>
        </Col>
      </Container>
    </>
  );
};

export default ChangePassword;
