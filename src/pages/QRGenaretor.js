import React from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import Select from "react-select";
import { BASE_URL } from "../config/index";
import axios from "axios";
import QRCode from "qrcode.react";
import { jsPDF } from "jspdf";
import { format } from "date-fns";
const api = axios.create({
  baseURL: `${BASE_URL}/information/forQR`,
});
const QRGenaretor = () => {
  const [loading, setLoading] = React.useState(false);
  const profileValue = JSON.parse(localStorage.getItem("token"));
  const cancelToken = React.useRef(null);
  const [timing, setTiming] = React.useState(null);
  const [car, setCar] = React.useState(null);
  const [route, setRoute] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [options, setOptionsCar] = React.useState(null);
  const [optionsTiming, setOptionsTiming] = React.useState(null);
  const [optionsRoute, setOptionsRoute] = React.useState(null);
  const createData = async () => {
    if (!timing || !car || !route) {
      alert("กรุณาใส่ข้อมูล");
    } else if (!timing) {
      alert("กรุณาใส่ข้อมูล เวลา");
    } else if (!car) {
      alert("กรุณาใส่ข้อมูล คนขับ");
    } else if (!route) {
      alert("กรุณาใส่ข้อมูล เส้นทาง");
    } else {
      setLoading(true);
    }
  };

  const handleChangeCar = async (selectedOption) => {
    setCar(selectedOption.value);
  };
  const handleChangeTiming = async (selectedOption) => {
    setTiming(selectedOption.value);
  };
  const handleChangeRoute = async (selectedOption) => {
    setRoute(selectedOption.value);
  };
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
      setOptionsRoute(resp.data.routePaths);
      setOptionsTiming(resp.data.optionsTimings);
      setOptionsCar(resp.data.cars);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const generatePDF = () => {
    // Defines the pdf
    let result = format(new Date(), "PPPP");
    let pdf = new jsPDF("p", "mm", "a4");

    // Transforms the canvas into a base64 image
    let base64Image = document.getElementById("qrcode").toDataURL();

    // Adds the image to the pdf
    pdf.addImage(base64Image, "png", 70, 50, 70, 70);
    pdf.text(105, 30, "Reckitt Benckiser", { align: "center" });
    pdf.text(105, 40, result, { align: "center" });
    // Downloads the pdf
    pdf.save("QR.pdf");
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
      <>
        <Container className="mt-5">
          <Row className="justify-content-evenly">
            <Col md={4}>Timing</Col>
            <Col md={4}>{timing}</Col>
          </Row>
          <Row className="justify-content-evenly">
            <Col md={4}>car</Col>
            <Col md={4}>{car}</Col>
          </Row>
          <Row className="justify-content-evenly">
            <Col md={4}>Route</Col>
            <Col md={4}>{route}</Col>
          </Row>
        </Container>
        <div className="text-center mt-5">
          <QRCode
            value={JSON.stringify({ timing: timing, car: car, route: route })}
            id="qrcode"
          />
          <br />
          <Button
            className="mt-3"
            variant="primary"
            type="button"
            onClick={() => {
              generatePDF();
            }}
          >
            Download pdf QR Code
          </Button>
        </div>
      </>
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
      <Container className="mt-3">
        <Row>
          <Col>
            <h2>QR Code Generetor</h2>

            <label id="route-label">Select Car</label>
            <Select onChange={handleChangeCar} options={options} />

            <label id="route-label">Select Route</label>
            <Select onChange={handleChangeRoute} options={optionsRoute} />

            <label id="timing-label">Select Timing</label>
            <Select onChange={handleChangeTiming} options={optionsTiming} />

            <Button
              className="mt-3"
              variant="primary"
              type="button"
              onClick={() => {
                createData();
              }}
            >
              Generete QR Code
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default QRGenaretor;
