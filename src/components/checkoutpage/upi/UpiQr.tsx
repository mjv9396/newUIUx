import React from "react";
import QRCode from "react-qr-code";

const UpiQr = ({ url }) => {
  // console.log("🚀 ~ UpiQr ~ url:", url);
  return (
    <div className="col-12 tabBox upiBox" id="upi">
      <div className="tabbox-inner px-xl-15">
        {/* <p>Collect UPI</p> */}
        <div className="toggle-list-box">
          <div className="toggle-list active" data-type="UP">
            <span
              className="font-size-12 d-inline-block mb-5 lang"
              data-key="payUsingUpi"
            >
              SCAN THE QR CODE
            </span>
            <div className="d-flex toggle-box pr-15 pt-10 w-100">
              <span className="font-size-26 pg-icon icon-upi mr-sm-10">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
              </span>
            </div>

            {url && (
              <div className="row">
                <div className="col-12 text-center">
                  <QRCode
                    size={170}
                    style={{
                      height: "auto",
                    }}
                    value={url}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default UpiQr;
