import React from "react";
import { Spinner, Table, Button } from "react-bootstrap";
import { BsTrash } from "react-icons/bs";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { BASE_URL } from "../config/index";

const api = axios.create({
  baseURL: `${BASE_URL}`,
});
const CallList = () => {
  const { addToast } = useToasts();
  const history = useHistory();
  const [loading, setLoading] = React.useState(false);
  const [datas, setData] = React.useState([]);
  const [error, setError] = React.useState(null);
  const cancelToken = React.useRef(null);
  const profileValue = JSON.parse(localStorage.getItem("token"));
  const deleteData = async (id) => {
    try {
      const message = await api.delete("/callDriver/" + id, {
        headers: {
          Authorization: "Bearer " + profileValue.access_token,
        },
      });
      addToast(message.data.message, { appearance: "success" });
      history.replace("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const getData = async () => {
    try {
      setLoading(true);
      const urlPath = `/callDriver/list`;
      const resp = await api.get(urlPath, {
        headers: {
          Authorization: "Bearer " + profileValue.access_token,
        },
        cancelToken: cancelToken.current.token,
      });
      setData(resp.data.data);
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
      <div className="container mt-3">
        <div className="row">
          <div className="col-md-12">
            <h1>รอบที่ทำการจองรถ</h1>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>เส้นทาง</th>
                  <th>รอบรถ</th>
                  <th>วัน</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {datas.map((data, index) => {
                  return (
                    <tr key={data.id}>
                      <td>{data.routePathName}</td>
                      <td>{data.roundName}</td>
                      <td>{data.createOn}</td>
                      <td>
                        {" "}
                        <Button
                          className="ml-2"
                          variant="danger"
                          size="sm"
                          onClick={() => deleteData(data.id)}
                        >
                          ยกเลิกการจอง
                          <BsTrash></BsTrash>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default CallList;
