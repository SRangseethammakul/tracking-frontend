import React from "react";
import { Row, Container, Col } from "react-bootstrap";
import QrReader from "react-qr-reader";
import { useSelector } from "react-redux";
const QRScaner = () => {
  const [data, setData] = React.useState({});
  const profileRedux = useSelector((state) => state.authReducer.profile);
  const handleScan = (dataScan) => {
    if (dataScan) {
      let route = JSON.parse(dataScan);
      if (route.route !== profileRedux.routePath) {
        alert("Error");
      } else {
        alert("Success");
      }
      setData(route);
    }
  };
  const handleError = (err) => {
    console.error(err);
  };
  return (
    <>
      <h2 className="text-center">QR </h2>
      <Container>
        <Row>
          <Col>
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: "100%" }}
            />
            <p>{data.route}</p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default QRScaner;
