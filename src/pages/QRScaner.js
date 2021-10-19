import React from "react";
import { Row, Container, Col } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import QrReader from "react-qr-reader";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import axios from "axios";
import { useHistory } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import { BASE_URL } from "../config/index";
const api = axios.create({
  baseURL: `${BASE_URL}`,
});
const QRScaner = () => {
  const MySwal = withReactContent(Swal);
  const { addToast } = useToasts();
  const history = useHistory();
  const [reading, setReading] = React.useState(true);
  const [data, setData] = React.useState({});
  const profileValue = JSON.parse(localStorage.getItem("token"));
  const profileRedux = useSelector((state) => state.authReducer.profile);
  const handleScan = (dataScan) => {
    if (dataScan) {
      setReading(false);
      let route = JSON.parse(dataScan);
      if (route.route !== profileRedux.routePath) {
        MySwal.fire({
          icon: "error",
          title: "คุณขึ้นรถผิดเส้นทาง",
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        MySwal.fire({
          icon: "warning",
          title: "ยืนยันการขึ้นรถ",
          showConfirmButton: true,
        }).then(async (result) => {
          if (result.value) {
            try {
              const pathURL = `/transaction/insert`;
              const resp = await api.post(
                pathURL,
                {
                  user: profileRedux.id,
                  car: route.car,
                  timing: route.timing,
                  routePath: profileRedux.routePath,
                },
                {
                  headers: {
                    Authorization: "Bearer " + profileValue.access_token,
                  },
                }
              );
              addToast(resp.data.data, { appearance: "success" });
              history.replace("/");
            } catch (error) {
              addToast(error.response.data.error.message, {
                appearance: "error",
              });
            }
          }
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
              <div className="text-center">
                <button
                  className="btn btn-outline-success ml-2"
                  onClick={() => setReading(true)}
                >
                  สแกนอีกครั้ง
                </button>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default QRScaner;
