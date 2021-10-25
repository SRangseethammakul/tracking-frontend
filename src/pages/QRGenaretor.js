import React from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import Select from "react-select";
import { BASE_URL } from "../config/index";
import axios from "axios";
import QRCode from "qrcode.react";
import { th } from "date-fns/locale";
import { format } from "date-fns";
import {
  PDFViewer,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
const styles = StyleSheet.create({
  page: {
    fontFamily: "Sarabun",
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  container: {
    alignSelf: "center",
    marginBottom: 10,
  },
  qrImage: {
    alignSelf: "center",
    width: "50%",
    height: "50%",
    marginTop: 20,
  },
  text: {
    color: "red",
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
});
Font.register({
  family: "Sarabun",
  fonts: [{ src: "./font/Sarabun-Regular.ttf" }],
});
const api = axios.create({
  baseURL: `${BASE_URL}/information/forQR`,
});
const QRGenaretor = () => {
  const [loading, setLoading] = React.useState(false);
  const [showing, setShowing] = React.useState(false);
  const profileValue = JSON.parse(localStorage.getItem("token"));
  const cancelToken = React.useRef(null);
  const [timing, setTiming] = React.useState(null);
  const [car, setCar] = React.useState(null);
  const [route, setRoute] = React.useState(null);

  const [timingName, setTimingName] = React.useState(null);
  const [carName, setCarName] = React.useState(null);
  const [routeName, setRouteName] = React.useState(null);

  const [error, setError] = React.useState(null);
  const [options, setOptionsCar] = React.useState(null);
  const [optionsTiming, setOptionsTiming] = React.useState(null);
  const [optionsRoute, setOptionsRoute] = React.useState(null);

  const setPDF = () => {
    const qrCodeDataUri = document.getElementById("qrcode").toDataURL();
    setLoading(qrCodeDataUri);
    setShowing(true);
  };
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
    setCarName(selectedOption.label);
    setCar(selectedOption.value);
  };
  const handleChangeTiming = async (selectedOption) => {
    setTimingName(selectedOption.label);
    setTiming(selectedOption.value);
  };
  const handleChangeRoute = async (selectedOption) => {
    setRouteName(selectedOption.label);
    setRoute(selectedOption.value);
  };
  const getData = async () => {
    try {
      setTiming(null);
      setCar(null);
      setRoute(null);
      setShowing(false);
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
  React.useEffect(() => {
    cancelToken.current = axios.CancelToken.source();
    getData();
    return () => {
      cancelToken.current.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
            {loading ? (
              <>
                <Container className="mt-5">
                  <Row className="justify-content-evenly">
                    <Col md={4}>Timing</Col>
                    <Col md={4}>{timingName}</Col>
                  </Row>
                  <Row className="justify-content-evenly">
                    <Col md={4}>car</Col>
                    <Col md={4}>{carName}</Col>
                  </Row>
                  <Row className="justify-content-evenly">
                    <Col md={4}>Route</Col>
                    <Col md={4}>{routeName}</Col>
                  </Row>
                </Container>
                <div className="text-center mt-5">
                  <QRCode
                    value={JSON.stringify({
                      timing: timing,
                      car: car,
                      route: route,
                    })}
                    id="qrcode"
                  />
                  <br />
                  <Button
                    className="mt-3"
                    variant="primary"
                    type="button"
                    onClick={() => {
                      setPDF();
                    }}
                  >
                    show pdf
                  </Button>
                  <br />
                  <Button
                    className="mt-3"
                    variant="danger"
                    type="button"
                    onClick={() => {
                      setCar(null);
                      setRoute(null);
                      setTiming(null);
                      setLoading(false);
                      setShowing(false);
                    }}
                  >
                    Claer Data
                  </Button>
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
          </Col>
        </Row>
        {showing && (
          <>
            <PDFViewer className="container-fluid mt-3" height={700}>
              <Document>
                <Page size="A4" style={styles.page}>
                  <View>
                    <Image
                      style={{ width: 100, alignSelf: "left" }}
                      src="./images/logo.png"
                    />
                  </View>
                  <View style={styles.title}>
                    <Text>Reckitt Benckiser</Text>
                  </View>
                  <View style={styles.container}>
                    <Text>
                      {format(new Date(), "PPPP", {
                        locale: th,
                      })}
                    </Text>
                    <Text>เส้นทาง {routeName}</Text>
                    <Text>ข้อมูลรถ {carName}</Text>
                    <Text>รายละเอียด {timingName}</Text>
                  </View>
                  <View>
                    <Image source={{ uri: loading }} style={styles.qrImage} />
                  </View>
                </Page>
              </Document>
            </PDFViewer>
          </>
        )}
      </Container>
    </div>
  );
};

export default QRGenaretor;
