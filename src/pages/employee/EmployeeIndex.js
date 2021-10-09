import React, { forwardRef } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import axios from "axios";
import MaterialTable from "material-table";
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
import { useToasts } from "react-toast-notifications";
import { BASE_URL } from "../../config/index";
const api = axios.create({
  baseURL: `${BASE_URL}/employee`,
});
const EmployeeIndex = () => {
  const { addToast } = useToasts();
  const [loading, setLoading] = React.useState(false);
  const [employees, setEmployee] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [departments, setDepartments] = React.useState({});
  const [routePaths, setroutePaths] = React.useState({});
  const [pickups, setPickups] = React.useState({});
  const cancelToken = React.useRef(null);
  const getData = async () => {
    try {
      setLoading(true);
      const urlPath = `/`;
      const resp = await api.get(urlPath, {
        cancelToken: cancelToken.current.token,
      });
      setEmployee(resp.data.data);
      setDepartments(resp.data.departments);
      setroutePaths(resp.data.routePaths);
      setPickups(resp.data.pickups);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleRowUpdate = (newData, oldData, resolve) => {
    api
      .put(`/${newData._id}`, {
        name: newData.name,
        employeeId: newData.employeeId,
        tel: newData.tel,
        isUsed: true,
        department: newData.Department.id,
        pickupPoint: newData.pickupPoint.id,
        routeUsed: newData.routePath.id,
      })
      .then((res) => {
        const dataUpdate = [...employees];
        const index = oldData.tableData.id;
        dataUpdate[index] = newData;
        setEmployee([...dataUpdate]);
        addToast(res.data.message, { appearance: "success" });
        resolve();
      })
      .catch((err) => {
        console.log(err.response.data.error.message);
        setError(err.response.data.error.message);
        resolve();
      });
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
      <Container className="mt-3">
        <Row>
          <Col>
            <MaterialTable
              icons={tableIcons}
              title="Employee Management"
              columns={[
                { title: "employeeId", field: "employeeId" },
                { title: "email",editable: "never", field: "email" },
                { title: "name", field: "name" },
                { title: "status", field: "isUsed" },
                {
                  title: "Department",
                  lookup: departments,
                  field: "Department.id",
                },
                {
                  title: "เส้นทาง",
                  lookup: routePaths,
                  field: "routePath.id",
                },
                {
                  title: "จุดรับส่ง",
                  lookup: pickups,
                  field: "pickupPoint.id",
                },
                { title: "tel", field: "tel" },
                // { title: "TimeStamp", lookup: { 'active': "ใช้งาน", 'inactive': "ปิดใช้งาน" }, field: "user_info", hidden: true },
              ]}
              data={employees}
              options={{
                filtering: true,
              }}
              editable={{
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

export default EmployeeIndex;
