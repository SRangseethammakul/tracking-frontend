import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { BsBoxArrowInRight } from "react-icons/bs";
import { Link } from "react-router-dom";
const HomePage = () => {
  return (
    <div>
      <h1 className="text-center mt-3">Welcome</h1>
      <h1 className="text-center mt-3">Reckitt Benckiser</h1>
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
                <Link to="/">
                  <Button variant="outline-success" className="float-right">
                    Profile
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
