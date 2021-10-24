import React from "react";
import axios from "axios";
import { Container, Col, Row, Form, Spinner } from "react-bootstrap";
import { BASE_URL } from "../config/index";
const api = axios.create({
  baseURL: `${BASE_URL}/users/profileInfo`,
});

const ProfileUser = () => {
  const cancelToken = React.useRef(null);
  const [error, setError] = React.useState(null);
  const [profile, setProfile] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const profileValue = JSON.parse(localStorage.getItem("token"));
  const getData = async () => {
    try {
      setLoading(true);
      const urlPath = `/`;
      const resp = await api.get(urlPath, {
        headers: {
          Authorization: "Bearer " + profileValue.access_token,
        },
        cancelToken: cancelToken.current.token,
      });
      setProfile(resp.data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
      <Container className="mt-5">
        <h1 class="display-5 mb-2">Information</h1>
        <Row className="mt-3">
          <Col>
            <Form.Group as={Row} className="mb-2" controlId="formPlaintextName">
                <Form.Label column sm="2">
                    name
                </Form.Label>
                <Col sm="10">
                    <Form.Control plaintext readOnly value={profile.name}/>
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-2" controlId="formPlaintextEmail">
                <Form.Label column sm="2">
                email
                </Form.Label>
                <Col sm="10">
                    <Form.Control plaintext readOnly value={profile.email}/>
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-2" controlId="formPlaintextRole">
                <Form.Label column sm="2">
                role
                </Form.Label>
                <Col sm="10">
                    <Form.Control plaintext readOnly value={profile.role}/>
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-2" controlId="formPlaintextEmployeeId">
                <Form.Label column sm="2">
                employeeId
                </Form.Label>
                <Col sm="10">
                    <Form.Control plaintext readOnly value={profile.employeeId}/>
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-2" controlId="formPlaintexttel">
                <Form.Label column sm="2">
                tel
                </Form.Label>
                <Col sm="10">
                    <Form.Control plaintext readOnly value={profile.tel}/>
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-2" controlId="formPlaintextDepartment">
                <Form.Label column sm="2">
                Department
                </Form.Label>
                <Col sm="10">
                    <Form.Control plaintext readOnly value={profile.Department}/>
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-2" controlId="formPlaintextpickupPoint">
                <Form.Label column sm="2">
                pickupPoint
                </Form.Label>
                <Col sm="10">
                    <Form.Control plaintext readOnly value={profile.pickupPoint}/>
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-2" controlId="formPlaintextroutePath">
                <Form.Label column sm="2">
                routePath
                </Form.Label>
                <Col sm="10">
                    <Form.Control plaintext readOnly value={profile.routePath}/>
                </Col>
            </Form.Group>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProfileUser;
