import React from "react";
import { Row, Container, Col } from "react-bootstrap";
import QrReader from "react-qr-reader";
const QRScaner = () => {
  const [data, setData] = React.useState(null);
  const handleScan = (dataScan) => {
    if (dataScan) {
      setData(dataScan);
    }
  };
  const handleError = (err) => {
    console.error(err);
  };
  return (
    <>
      <h2 className="text-center">QR</h2>
      <Container>
        <Row>
          <Col>
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: "100%" }}
            />
            <p>{data}</p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default QRScaner;
