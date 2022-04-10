import React, { forwardRef } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import MaterialTable from "material-table";
import axios from "axios";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import { BASE_URL } from "../../config/index";
const api = axios.create({
  baseURL: `${BASE_URL}/driver`,
});
const CarIndex = () => {
  const [loading, setLoading] = React.useState(false);
  const [drivers, setDriver] = React.useState([]);
  const [routePaths, setroutePaths] = React.useState({});
  const [error, setError] = React.useState(null);
  const cancelToken = React.useRef(null);
  const profileValue = JSON.parse(localStorage.getItem("token"));
  const handleRowUpdate = (newData, oldData, resolve) => {
    api
      .put(
        `/${newData.id}`,
        {
          isUsed: newData.isUsed,
          name: newData.name,
          status: newData.isUsed,
          tel: newData.tel,
          driverId: newData.driverId,
          routeUsed: newData.routePath.id,
        },
        {
          headers: {
            Authorization: "Bearer " + profileValue.access_token,
          },
        }
      )
      .then((res) => {
        const dataUpdate = [...drivers];
        const index = oldData.tableData.id;
        dataUpdate[index] = newData;
        setDriver([...dataUpdate]);
        resolve();
      })
      .catch((err) => {
        setError(err.message);
        if (err.response) {
          setError(err.response.data.message);
        } else if (err.request) {
          console.log(err.request);
          setError(err.request);
        } else {
          setError(err.message);
          console.log("Error", err.message);
        }
        resolve();
      });
  };

  const handleRowAdd = (newData, resolve) => {
    api
      .post("/", newData, {
        headers: {
          Authorization: "Bearer " + profileValue.access_token,
        },
      })
      .then((res) => {
        let dataToAdd = [...drivers];
        dataToAdd.push(newData);
        setDriver(dataToAdd);
        resolve();
      })
      .catch((err) => {
        setError(err.message);
        resolve();
      });
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
      setDriver(resp.data.data);
      setroutePaths(resp.data.routePaths);
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
  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => (
      <ChevronRight {...props} ref={ref} />
    )),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
      <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => (
      <ArrowDownward {...props} ref={ref} />
    )),
    ThirdStateCheck: forwardRef((props, ref) => (
      <Remove {...props} ref={ref} />
    )),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  };
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
      <Container className="mt-4">
        <Row>
          <Col>
            <MaterialTable
              icons={tableIcons}
              title="Driver Management"
              columns={[
                {
                  title: "Profile",
                  field: "driverImage",
                  sorting: false,
                  filtering: false,
                  editable: "never",
                  render: (rowData) => (
                    <img
                      alt="Line user profile"
                      src={rowData.driverImage}
                      style={{ width: 40, borderRadius: "50%" }}
                    />
                  ),
                },
                { title: "id", field: "id", editable: "never", hidden: true },
                { title: "name", field: "name" },
                {
                  title: "status",
                  field: "isUsed",
                  type: "boolean",
                },
                { title: "tel", field: "tel" },
                { title: "driver id", field: "driverId" },
                {
                  title: "เส้นทาง",
                  lookup: routePaths,
                  field: "routePath.id",
                },
              ]}
              data={drivers}
              options={{
                filtering: true,
              }}
              editable={{
                onRowAdd: (newData) =>
                  new Promise((resolve) => {
                    handleRowAdd(newData, resolve);
                  }),
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve) => {
                    handleRowUpdate(newData, oldData, resolve);
                  }),
              }}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CarIndex;
