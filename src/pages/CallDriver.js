import React from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import axios from "axios";
import Select from "react-select";
import { useHistory, useLocation } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { BASE_URL } from "../config/index";
const api = axios.create({
  baseURL: `${BASE_URL}`,
});
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const CallDriver = () => {
  const query = useQuery();
  const MySwal = withReactContent(Swal);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const cancelToken = React.useRef(null);
  const [rounds, setRound] = React.useState([]);
  const [routeUse, setRouteUse] = React.useState(null);
  const [roundUse, setRoundUse] = React.useState(null);
  const [pickupUse, setPickupUse] = React.useState(null);
  const [routePass, setRoutePass] = React.useState(null);
  const [routePaths, setPath] = React.useState([]);
  const [pickups, setPickup] = React.useState([]);
  const profileValue = JSON.parse(localStorage.getItem("token"));
  const history = useHistory();
  const handleChangePath = async (selectedOption) => {
    setRouteUse(selectedOption.value);
  };
  const handleChangeRound = async (selectedOption) => {
    setRoundUse(selectedOption.value);
  };
  const handleChangePickup = async (selectedOption) => {
    setPickupUse(selectedOption.value);
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
        return 0;
      }
      if (!roundUse) {
        MySwal.fire({
          icon: "error",
          title: "กรุณาเลือก รอบเวลา ของคุณ",
          showConfirmButton: false,
          timer: 3000,
        });
        return 0;
      }
      if (!pickupUse) {
        MySwal.fire({
          icon: "error",
          title: "กรุณาเลือก จุดรับส่ง ของคุณ",
          showConfirmButton: false,
          timer: 3000,
        });
        return 0;
      }
      let check = document.getElementById("flexCheckIndeterminate").checked;
      setLoading(true);
      const pathURL = `/callDriver`;
      const resp = await api.post(
        pathURL,
        {
          round: roundUse,
          routePath: routeUse,
          pickupUse: pickupUse,
          checkData: check,
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
        showConfirmButton: true,
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
  const getIndex = (array, key) => {
    return array.findIndex((o) => o.value === key);
  };
  const getData = async () => {
    try {
      const routePassFromQueue = query.get("route") || null;
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
      setPickup(resp.data.pickupPoints);
      const index = await getIndex(resp.data.routePaths, routePassFromQueue);
      setRoutePass(index);
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
    <>
      <Container className="mt-5">
        <Row>
          <Col>
            <label id="route-label">Select routePaths</label>
            <Select
              onChange={handleChangePath}
              options={routePaths}
              defaultValue={routePaths[routePass]}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <label id="route-label">Select Round</label>
            <Select onChange={handleChangeRound} options={rounds} />
          </Col>
        </Row>
        <Row>
          <Col>
            <label id="route-label">Select Pickup Point</label>
            <Select onChange={handleChangePickup} options={pickups} />
          </Col>
        </Row>
        <Row className="mt-2">
          <div>
            <input
              className="form-check-input"
              type="checkbox"
              defaultValue
              id="flexCheckIndeterminate"
            />
            <label
              className="form-check-label px-2"
              htmlFor="flexCheckIndeterminate"
            >
              {" "}
              ต้องการความช่วยเหลือพิเศษ
            </label>
          </div>
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
