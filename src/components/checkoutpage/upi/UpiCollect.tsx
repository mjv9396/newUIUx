import React from "react";
import FormikControl from "../../wrapperComponents/FormikControl";

const UpiCollect = () => {
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
              PAY USING UPI ID
            </span>
            <div className="d-flex toggle-box pr-15 pt-10 w-100">
              <span className="font-size-26 pg-icon icon-upi mr-sm-10">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
              </span>
              {/* <span className="d-flex flex-column w-100">
                                <span className="d-flex w-100 justify-content-between">
                                    <span className="font-size-12 font-weight-bold toggle-title lang" data-key="vpaAddress">UPI ID</span>
                                </span>
                                <span className="d-block font-size-12">Google Pay, BHIM, PhonePe &amp; more</span>
                            </span> */}
            </div>
            <div className="toggle-content pb-10   pr-15">
              <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <div className="vpaSection">
                    {/* <label className="placeHolderText placeHolderTextVPA font-size-12 text-grey-light mb-0 lang field-title" data-key="vpaAddress">UPI ID</label>
                                    <input type="text" name="VPA" id="vpaCheck" placeholder=" " maxLength={45} className="inputField form-control" /> */}
                    <FormikControl
                      control="upitextfield"
                      name="custVpa"
                      // label="UPI ID"
                      className="inputField form-control"
                      // requiredField
                    />
                  </div>
                  {/* <p className="red1 lang" data-key="invalidVpa" id="red1">Invalid UPI ID</p>
                                <p className="red1 lang" data-key="enterVpa" id="enterVpa">Please Enter UPI ID</p> */}
                </div>
                <div className="col-12 mt-10">
                  <label className="vpaPara  lang mb-0" data-key="vpaPara">
                    UPI ID is a unique Payment address that is linked to a
                    person's bank account to make payments.
                  </label>
                </div>
                <div>
                  <small id="errorBox" className="text-danger"></small>
                </div>
                <input
                  type="hidden"
                  id="vpaSaveFlag"
                  name="vpaSaveFlag"
                  value="false"
                />
              </div>
              <div className="row undefined">
                <div className="col-md-6 card_charges d-none">
                  <span className="mr-10">
                    <img src="/pgui/img/info.png" alt="" />
                    &nbsp;&nbsp;
                  </span>
                  <span id="UP-tax-declaration"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UpiCollect;
