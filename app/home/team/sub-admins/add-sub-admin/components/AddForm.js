"use client";
import { addSubAdmin } from "@/app/formBuilder/admin";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import InfoLabel from "@/app/ui/infoLabel/InfoLabel";
import Label from "@/app/ui/label/Label";
import { password } from "@/app/utils/message";
import { validate } from "@/app/validations/forms/AddSubAdminValidations";
import { sidebarJson } from "@/constants/sidebar";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const AddForm = () => {
  const router = useRouter();
  const formRef = useRef(null);
  const { loading, error, response, postData } = usePostRequest(
    endPoints.settings.addSubAdmin
  );

  const [formData, setFormData] = useState(addSubAdmin);
  const [errors, setErrors] = useState({});

  // handle input change
  // handle input change
  const handleChange = (event) => {
    const { name, value, type } = event.target;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        permissions: { ...formData.permissions, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({});
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = await validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    await postData(formData);
  };
  useEffect(() => {
    if (response && !error) {
      setFormData(addSubAdmin);
      formRef.current.reset();
    }
  }, [response, error]);

  console.log("formData", sidebarJson);

  const [permissions, setPermissions] = useState([]);

  const mapPermissions = () => {
    let list = [];
    // list: [
    //   {
    //     moduleName: "User Management",
    //     pages: [
    //       {
    //         pageName: "View Sub Merchants",
    //         isRead: true,
    //         isWrite: false,
    //       },
    //       {
    //         pageName: "View Merchant",
    //         isRead: true,
    //         isWrite: false,
    //       },
    //       {...
    //     ],
    //   }
    // ]
    sidebarJson.forEach((item) => {
      let module = {
        moduleName: item.moduleName,
        pages: [],
      };
      item.pageDetails.forEach((page) => {
        let pageData = {
          pageName: page.pageName,
          isRead: false,
          isWrite: false,
        };
        if (formData.permissions[page.pageName]) {
          pageData.isRead = formData.permissions[page.pageName].isRead;
          pageData.isWrite = formData.permissions[page.pageName].isWrite;
        }
        module.pages.push(pageData);
      });
      list.push(module);
    });
    setPermissions(list);
  };

  useEffect(() => {
    mapPermissions();
  }, []);

  console.log("permissions", permissions);

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit} ref={formRef}>
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="fullName" label="Name" required={true} />
            <input
              type="text"
              name="fullName"
              id="fullName"
              placeholder="Enter name"
              className="forminput"
              onChange={handleChange}
              maxLength={256}
              value={formData.fullName}
            />
            {errors.fullName && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.fullName}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="userId" label="Username" required={true} />
            <input
              type="email"
              name="userId"
              id="userId"
              placeholder="Enter email/username"
              className="forminput"
              onChange={handleChange}
              maxLength={256}
              value={formData.userId}
              autoComplete="off"
              readOnly
              onFocus={(e) => {
                e.target.removeAttribute("readOnly");
                e.target.setAttribute("autocomplete", "off");
              }}
            />
            {errors.userId && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.userId}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label
              htmlFor="contactNumber"
              label="Contact Number"
              required={true}
            />
            <input
              type="text"
              name="contactNumber"
              id="contactNumber"
              placeholder="Enter contact number"
              className="forminput"
              onChange={handleChange}
              value={formData.contactNumber}
            />
            {errors.contactNumber && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.contactNumber}
              </small>
            )}
          </div>
          <div className="col-md-6 col-sm-12 mb-2">
            <Label htmlFor="password" label="Password" required={true} />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter password"
              className="forminput"
              onChange={handleChange}
              value={formData.password}
              autoComplete="off"
              readOnly
              onFocus={(e) => {
                e.target.removeAttribute("readOnly");
                e.target.setAttribute("autocomplete", "off");
              }}
            />
            {errors.password && (
              <small className="text-danger">
                <span className="text-danger"> *</span>
                {errors.password}
              </small>
            )}
            <InfoLabel content={password} />
            <InfoLabel content="Password must contain at least one uppercase letter" />
            <InfoLabel content="Password must contain at least one special character" />
          </div>
          <h6>Account Permissions:</h6>

          {/* sidebar  */}

          {permissions.map((item, index) => {
            return (
              <div className="py-2" key={index}>
                <div className="col-md-12 col-sm-12 mb-2">
                  <h4 className="mx-0 h6">{item.moduleName}</h4>
                </div>
                <div className="d-flex flex-column w-100 flex-wrap">
                  {item.pages.map((page, index) => {
                    // two checkboxes Read and Write for each page
                    // pagename (heading (not checkbox)) :  read (checkbox) : write (checkbox)
                    return (
                      <div
                        key={index}
                        style={{
                          borderRight: "1px solid #ccc",
                          minWidth: "fit-content",
                        }}
                        className="d-flex align-items-center gap-2 "
                      >
                        {" "}
                        <span className="w-25">{page.pageName}</span>
                        <div className="d-flex align-items-center gap-2 ">
                          <label htmlFor={page.pageName}>
                            <span className="mx-1 ">Read</span>
                          </label>
                          <input
                            type="checkbox"
                            name={page.pageName}
                            id={page.pageName}
                            value={page.pageName}
                            onChange={(e) => {
                              handleChange(e);
                              setPermissions((prev) => {
                                const updatedPermissions = [...prev];
                                updatedPermissions[index].pages[index].isRead =
                                  e.target.checked;
                                return updatedPermissions;
                              });
                            }}
                          />
                        </div>
                        <div className="d-flex align-items-center gap-2 ">
                          <label htmlFor={page.pageName}>
                            <span className="mx-1 ">Write</span>
                          </label>
                          <input
                            type="checkbox"
                            name={page.pageName}
                            id={page.pageName}
                            value={page.pageName}
                            onChange={(e) => {
                              handleChange(e);
                              setPermissions((prev) => {
                                const updatedPermissions = [...prev];
                                updatedPermissions[index].pages[index].isWrite =
                                  e.target.checked;
                                return updatedPermissions;
                              });
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* <div className="row">
            <div className="d-flex align-items-center gap-2">
              <h6 className="mb-0">Permissions</h6>
              <div className="d-flex align-items-center">
                <label htmlFor="viewSubMerchants">
                  <span className="mx-1 ">Read</span>
                </label>
                <input
                  type="checkbox"
                  name="viewSubMerchants"
                  id="viewSubMerchants"
                  value="/home/team/sub-merchants"
                  onChange={handleChange}
                />
              </div>
              <div className="d-flex align-items-center">
                <label htmlFor="viewSubMerchants">
                  <span className="mx-1 ">Write</span>
                </label>
                <input
                  type="checkbox"
                  name="viewSubMerchants"
                  id="viewSubMerchants"
                  value="/home/team/sub-merchants"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="viewSubMerchants"
                id="viewSubMerchants"
                value="/home/team/sub-merchants"
                onChange={handleChange}
              />
              <span className="mx-1">View Sub Merchants</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="viewMerchant"
                id="viewMerchant"
                value="/home/user-management/merchants"
                onChange={handleChange}
              />
              <span className="mx-1">View Merchant</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="addMerchant"
                id="addMerchant"
                value="/home/user-management/merchants/add-merchant"
                onChange={handleChange}
              />
              <span className="mx-1">Add Merchant</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="viewAcquirer"
                id="viewAcquirer"
                value="/home/user-management/acquirer"
                onChange={handleChange}
              />
              <span className="mx-1">View Acquirer</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="addAcquirer"
                id="addAcquirer"
                value="/home/user-management/acquirer/add-acquirer"
                onChange={handleChange}
              />
              <span className="mx-1">Add Acquirer</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="viewResellers"
                id="viewResellers"
                value="/home/user-management/resellers"
                onChange={handleChange}
              />
              <span className="mx-1">View Resellers</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="addReseller"
                id="addReseller"
                value="/home/user-management/resellers/add-reseller"
                onChange={handleChange}
              />
              <span className="mx-1">Add Reseller</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="viewOrders"
                id="viewOrders"
                value="/home/transaction/orders"
                onChange={handleChange}
              />
              <span className="mx-1">View Orders</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="viewTransaction"
                id="viewTransaction"
                value="/home/transaction/payin"
                onChange={handleChange}
              />
              <span className="mx-1">View Transaction</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="viewCountry"
                id="viewCountry"
                value="/home/settings/country"
                onChange={handleChange}
              />
              <span className="mx-1">View Country</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="addCountry"
                id="addCountry"
                value="/home/settings/country/add-country"
                onChange={handleChange}
              />
              <span className="mx-1">Add Country</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="addCurrency"
                id="addCurrency"
                value="/home/settings/currency/add-currency"
                onChange={handleChange}
              />
              <span className="mx-1">Add Currency</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="viewCurrency"
                id="viewCurrency"
                value="/home/settings/currency"
                onChange={handleChange}
              />
              <span className="mx-1">View Currency</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="addPaymentType"
                id="addPaymentType"
                value="/home/settings/payment-type/add-payment-type"
                onChange={handleChange}
              />
              <span className="mx-1">Add Payment Type</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="viewPaymentType"
                id="viewPaymentType"
                value="/home/settings/payment-type"
                onChange={handleChange}
              />
              <span className="mx-1">View Payment Type</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="addMopType"
                id="addMopType"
                value="/home/settings/mop-type/add-mop-type"
                onChange={handleChange}
              />
              <span className="mx-1">Add MOP Type</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="viewMopType"
                id="viewMopType"
                value="/home/settings/mop-type"
                onChange={handleChange}
              />
              <span className="mx-1">View MOP Type</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="addSurcharge"
                id="addSurcharge"
                value="/home/settings/surcharge/add-surcharge"
                onChange={handleChange}
              />
              <span className="mx-1">Add Surcharge</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="viewSurcharge"
                id="viewSurcharge"
                value="/home/settings/surcharge"
                onChange={handleChange}
              />
              <span className="mx-1">View Surcharge</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="authSettlement"
                id="authSettlement"
                value="/home/settlements/auth-settlement"
                onChange={handleChange}
              />
              <span className="mx-1">Authorized Settlement</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="saleSettlement"
                id="saleSettlement"
                value="/home/settlements/sale-settlement"
                onChange={handleChange}
              />
              <span className="mx-1">Captured Settlement</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="allSettlement"
                id="allSettlement"
                value="/home/settlements/auth-settlement"
                onChange={handleChange}
              />
              <span className="mx-1">All Settlement</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2 flex-wrap">
              <input
                type="checkbox"
                name="refund"
                id="refund"
                value="/home/settlements/refund"
                onChange={handleChange}
              />
              <span className="mx-1">Refund</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2 flex-wrap">
              <input
                type="checkbox"
                name="viewPaymentLink"
                id="viewPaymentLink"
                value="/home/payment-links"
                onChange={handleChange}
              />
              <span className="mx-1">View Payment Link</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2 flex-wrap">
              <input
                type="checkbox"
                name="viewChargeBack"
                id="viewChargeBack"
                value="/home/charge-back"
                onChange={handleChange}
              />
              <span className="mx-1">Charge Back</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2 flex-wrap">
              <input
                type="checkbox"
                name="viewRemittance"
                id="viewRemittance"
                value="/home/remittance"
                onChange={handleChange}
              />
              <span className="mx-1">Remittance</span>
            </div>
            <div className="col-md-3 col-sm-12 mb-2">
              <input
                type="checkbox"
                name="fraudPrevention"
                id="fraudPrevention"
                value="/home/fraud-prevention"
                onChange={handleChange}
              />
              <span className="mx-1">Fraud Prevention</span>
            </div>
          </div> */}
        </div>
        <div className="d-flex justify-content-between gap-2 mt-2 mb-2">
          <button type="button" className="back" onClick={() => router.back()}>
            Back
          </button>
          <span className="d-flex gap-2">
            <button
              type={loading ? "button" : "submit"}
              className="submit"
              disabled={loading}
            >
              {loading ? "Please Wait..." : "Submit"}
            </button>
            <button
              type="reset"
              className="reset"
              onClick={() => {
                setErrors({});
                setFormData(addSubAdmin);
              }}
            >
              Clear
            </button>
          </span>
        </div>
      </form>
    </div>
  );
};

export default AddForm;
