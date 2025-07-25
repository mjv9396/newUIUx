import React from "react";
import QRCode from "react-qr-code";

const UpiQr = ({ url }) => {
  return (
    <>
      <div
        style={{
          height: "auto",
          margin: "0 auto",
          width: "100%",
          gap: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <h6>Scan the QR</h6>
        <QRCode
          size={180}
          style={{ height: "auto" }}
          value={url}
          viewBox={`0 0 256 256`}
        />
      </div>
    </>
  );
};
export default UpiQr;
