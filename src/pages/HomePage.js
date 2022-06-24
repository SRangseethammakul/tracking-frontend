import React from "react";
import axios from "axios";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { BsBoxArrowInRight } from "react-icons/bs";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { BASE_URL } from "../config/index";

const api = axios.create({
  baseURL: `${BASE_URL}`,
});
const HomePage = () => {
  const history = useHistory();
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [check, setCheck] = React.useState(false);
  const profileValue = JSON.parse(localStorage.getItem("token"));
  const cancelToken = React.useRef(null);
  const getData = async () => {
    try {
      setLoading(true);
      const urlPath = `/asconfigs/bubble`;
      const resp = await api.get(urlPath, {
        headers: {
          Authorization: "Bearer " + profileValue.access_token,
        },
        cancelToken: cancelToken.current.token,
      });
      setCheck(resp.data.check);
    } catch (err) {
      if (err.response?.status === 401) {
        history.replace("/login");
      }
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
    <div>
      <h1 className="text-center mt-3">Welcome</h1>
      <h1 className="text-center mt-3">Reckitt Benckiser</h1>
      <h2 className="text-center mt-3">
        {check ? "Bubble and Seal" : "No Bubble and Seal"}
      </h2>
      <Container className="mt-3">
        <Row>
          <Col xs={12} md={6}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Scan QR Code</h5>
                <p className="card-text">ทำการสแกนเพื่อขึ้นรถ</p>
                <Link to="/scan">
                  <Button variant="outline-success" className="float-right">
                    Scan QR <BsBoxArrowInRight />
                  </Button>{" "}
                </Link>
              </div>
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Profile</h5>
                <p className="card-text">จัดการ Profile</p>
                <Link to="/profile">
                  <Button variant="outline-success" className="float-right">
                    Profile <BsBoxArrowInRight />
                  </Button>{" "}
                </Link>
              </div>
            </div>
          </Col>
        </Row>
        <br></br>
        <Row>
          <Col xs={12} md={6}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">calldriver</h5>
                <p className="card-text">calldriver</p>
                <Link to="/calldriver">
                  <Button variant="outline-success" className="float-right">
                    calldriver <BsBoxArrowInRight />
                  </Button>{" "}
                </Link>
              </div>
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Call List</h5>
                <p className="card-text">Call List</p>
                <Link to="/calllist">
                  <Button variant="outline-success" className="float-right">
                    Call List <BsBoxArrowInRight />
                  </Button>{" "}
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
