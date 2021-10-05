import React from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import Select from "react-select";
var QRCode = require("qrcode.react");
const QRGenaretor = () => {
  const [loading, setLoading] = React.useState(false);
  const [timing, setTiming] = React.useState(null);
  const [driver, setDriver] = React.useState(null);
  const [route, setRoute] = React.useState(null);
  const options = [
    { value: "พขร  นายพิทักษ์   ตุ้มทอง", label: "พขร  นายพิทักษ์   ตุ้มทอง" },
    { value: "พขร  นายภิรมย์  ศรีอาจ", label: "พขร  นายภิรมย์  ศรีอาจ" },
    {
      value: "พขร  นายกิตติศักดิ์  ทรัพย์สิน",
      label: "พขร  นายกิตติศักดิ์  ทรัพย์สิน",
    },
  ];
  const optionsTiming = [
    { value: "in", label: "in to factory" },
    { value: "out", label: "out factory" },
  ];
  const optionsRoute = [
    { value: "บางพลี", label: "บางพลี" },
    { value: "สายเคหะ", label: "สายเคหะ" },
    { value: "สายกิ่งแก้ว", label: "สายกิ่งแก้ว" },
    { value: "บางนา", label: "บางนา" },
  ];
  const createData = async () => {
    if (!timing || !driver || !route) {
      alert("กรุณาใส่ข้อมูล");
    } else if (!timing) {
      alert("กรุณาใส่ข้อมูล เวลา");
    } else if (!driver) {
      alert("กรุณาใส่ข้อมูล คนขับ");
    } else if (!route) {
      alert("กรุณาใส่ข้อมูล เส้นทาง");
    } else {
      setLoading(true);
    }
  };
  const handleChangeDriver = async (selectedOption) => {
    setDriver(selectedOption.value);
  };
  const handleChangeTiming = async (selectedOption) => {
    setTiming(selectedOption.value);
  };
  const handleChangeRoute = async (selectedOption) => {
    setRoute(selectedOption.value);
  };
  if (loading === true) {
    return (
      <>
        <Container className="mt-5">
          <Row className="justify-content-evenly">
            <Col md={4}>Timing</Col>
            <Col md={4}>{timing}</Col>
          </Row>
          <Row className="justify-content-evenly">
            <Col md={4}>Driver</Col>
            <Col md={4}>{driver}</Col>
          </Row>
          <Row className="justify-content-evenly">
            <Col md={4}>Route</Col>
            <Col md={4}>{route}</Col>
          </Row>
        </Container>
        <div className="text-center mt-5">
          <QRCode value={`${timing}|${driver}|${route}`} />
        </div>
      </>
    );
  }
  return (
    <div>
      <Container className="mt-3">
        <Row>
          <Col>
            <h2>QR Code Generetor</h2>
            <label id="driver-label">Select Driver</label>
            <Select onChange={handleChangeDriver} options={options} />
            <label id="timing-label">Select Timing</label>
            <Select onChange={handleChangeTiming} options={optionsTiming} />
            <label id="route-label">Select Route</label>
            <Select onChange={handleChangeRoute} options={optionsRoute} />
            <label id="route-label">Select Car</label>
            <Select onChange={handleChangeRoute} options={optionsRoute} />
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
