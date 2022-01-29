import React from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import axios from "axios";
import Select from "react-select";
import { useHistory } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { BASE_URL } from "../config/index";
const api = axios.create({
  baseURL: `${BASE_URL}`,
});
const CallDriver = () => {
  const MySwal = withReactContent(Swal);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const cancelToken = React.useRef(null);
  const [rounds, setRound] = React.useState([]);
  const [routeUse, setRouteUse] = React.useState(null);
  const [roundUse, setRoundUse] = React.useState(null);
  const [routePaths, setPath] = React.useState([]);
  const profileValue = JSON.parse(localStorage.getItem("token"));
  const history = useHistory();
  const handleChangePath = async (selectedOption) => {
    setRouteUse(selectedOption.value);
  };
  const handleChangeRound = async (selectedOption) => {
    setRoundUse(selectedOption.value);
  };
  const sendData = async () => {
    try {
      if (!routeUse) {
        MySwal.fire({
          icon: "error",
          title: "กรุณาเลือก เส้นทาง ของคุณ",
          showConfirmButton: false,
          timer: 3000,
        });
      }
      if (!roundUse) {
        MySwal.fire({
          icon: "error",
          title: "กรุณาเลือก รอบเวลา ของคุณ",
          showConfirmButton: false,
          timer: 3000,
        });
      }
      setLoading(true);
      const pathURL = `/callDriver`;
      const resp = await api.post(
        pathURL,
        {
          round: roundUse,
          routePath: routeUse,
        },
        {
          headers: {
            Authorization: "Bearer " + profileValue.access_token,
          },
        }
      );
      MySwal.fire({
        icon: "success",
        title: resp.data.message,
        showConfirmButton: false,
        timer: 3000,
      });
      history.replace("/");
    } catch (err) {
      MySwal.fire({
        icon: "error",
        title: err.response.data.error.message,
        showConfirmButton: true,
      });
      setError(err.response.data.error.message);
    } finally {
      history.replace("/");
    }
  };
  const getData = async () => {
    try {
      setLoading(true);
      const urlPath = `/information/calldriver`;
      const resp = await api.get(urlPath, {
        headers: {
          Authorization: "Bearer " + profileValue.access_token,
        },
        cancelToken: cancelToken.current.token,
      });
      setRound(resp.data.rounds);
      setPath(resp.data.routePaths);
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
        <Row>
          <Col>
            <label id="route-label">Select routePaths</label>
            <Select onChange={handleChangePath} options={routePaths} />
          </Col>
        </Row>
        <Row>
          <Col>
            <label id="route-label">Select Round</label>
            <Select onChange={handleChangeRound} options={rounds} />
          </Col>
        </Row>
        <Row>
          <div className="text-center mt-5">
            <button
              className="btn btn-outline-success ml-2"
              onClick={() => sendData()}
            >
              จองรถ
            </button>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default CallDriver;
