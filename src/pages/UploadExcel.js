import React from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { FaRegFileExcel } from "react-icons/fa";
import { useToasts } from "react-toast-notifications";
import axios from "axios";
import readXlsxFile from "read-excel-file";
import { BASE_URL } from "../config/index";
const api = axios.create({
  baseURL: `${BASE_URL}/uploadexcel`,
});
const UploadExcel = () => {
  const [loading, setLoading] = React.useState(false);
  const [checkButton, setCheckButton] = React.useState(false);
  const [checkPrepare, setCheckPrepare] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState();
  const [isFilePicked, setIsFilePicked] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [error, setError] = React.useState(null);
  const profileValue = JSON.parse(localStorage.getItem("token"));
  const { addToast } = useToasts();
  const onFileUpload = async () => {
    if (isFilePicked) {
      readXlsxFile(selectedFile).then((rows) => {
        let obje = rows.map((el, index) => {
          return {
            name: el[0],
            employeeId: el[1],
            password: el[2],
            tel: el[3],
            department: el[4],
            pickupPoint: el[5],
            routePath: el[5],
          };
        });
        setData(obje);
        setCheckButton(true);
        setCheckPrepare(false);
      });
    } else {
      setLoading(false);
      addToast("กรุณาเลือก Excel", {
        appearance: "error",
        autoDismiss: true,
      });
      setError("Plase Select File");
    }
  };
  const changeHandler = (event) => {
    if (
      event.target.files[0].type !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      addToast("รูปแบบไฟล์ไม่ถูกต้อง", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
    setCheckPrepare(true);
  };
  const checkData = () => {
    api
      .post("/", data, {
        headers: {
          Authorization: "Bearer " + profileValue.access_token,
        },
      })
      .then((res) => {
        addToast(res.data.data, { appearance: "success" });
      })
      .catch((err) => {
        setError(err.message);
      });
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
        <h1>
          <FaRegFileExcel color="#558776" /> Eecel
        </h1>

        <Row>
          <Col>
            <label htmlFor="fileUpload">Upload PDF File</label>
            <br />
            <input
              type="file"
              name="file"
              id="fileUpload"
              onChange={changeHandler}
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            />
            {checkPrepare && (
              <>
                <button className="btn btn-outline-info" onClick={onFileUpload}>
                  Prepare!
                </button>
              </>
            )}

            {checkButton && (
              <>
                <button className="btn btn-outline-danger" onClick={checkData}>
                  Create!
                </button>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UploadExcel;
