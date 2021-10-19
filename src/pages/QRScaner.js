import React from "react";
import { Row, Container, Col } from "react-bootstrap";
import QrReader from "react-qr-reader";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const QRScaner = () => {
  const MySwal = withReactContent(Swal);
  const [reading, setReading] = React.useState(true);
  const [data, setData] = React.useState({});
  const profileRedux = useSelector((state) => state.authReducer.profile);
  const handleScan = (dataScan) => {
    if (dataScan) {
      setReading(false)
      let route = JSON.parse(dataScan);
      if (route.route !== profileRedux.routePath) {
        MySwal.fire({
          icon: "error",
          title: "คุณขึ้นรถผิดเส้นทาง",
          showConfirmButton: false,
          timer: 3000,
        }).then(() => {
          return MySwal.fire(<p>Shorthand works too</p>);
        });
      } else {
        MySwal.fire({
          icon: "success",
          title: "ยืนยันการขึ้นรถ",
          showConfirmButton: true,
        }).then(() => {
          return MySwal.fire(<p>Shorthand works too</p>);
        });
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
        {reading ? (
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
        ) : (
          <Row>
            <Col>
            <h2>Hello</h2>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default QRScaner;
