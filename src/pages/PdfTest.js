import React from "react";
import QRCode from "qrcode.react";
import { Button } from "react-bootstrap";
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
  },
});
Font.register({
  family: "Sarabun",
  fonts: [{ src: "./font/Sarabun-Regular.ttf" }],
});

const PdfTest = () => {
  const [loading, setLoading] = React.useState(null);
  const setPDF = () => {
    const qrCodeCanvas = document.querySelector("canvas");
    const qrCodeDataUri = qrCodeCanvas.toDataURL("image/jpg", 0.3);
    setLoading(qrCodeDataUri);
  };
  return (
    <>
      {}
      <QRCode value="http://facebook.github.io/react/" size={50} />
      <Button className="mt-3" variant="primary" type="button" onClick={setPDF}>
        Generete QR Code
      </Button>
      <PDFViewer className="container-fluid mt-3" height={700}>
        <Document>
          <Page size="A4" style={styles.page}>
            <View>
              <Image source={{ uri: loading }} style={styles.qrImage} />
            </View>
            <View style={styles.container}>
              <Text>Section #1 กกก</Text>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </>
  );
};

export default PdfTest;
