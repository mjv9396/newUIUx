"use client";
import styles from "../page.module.css";
import avatar from "../../../../../../public/images/programmer.png";
import Tabs from "./Tabs";
import { useEffect, useState } from "react";
import Image from "next/image";
import Operational from "./Operational";
import Business from "./Business";
import Payin from "./Payin";
import { useParams } from "next/navigation";
import { decryptParams } from "@/app/utils/decryptions";
import useGetRequest from "@/app/hooks/useFetch";
import { endPoints } from "@/app/services/apiEndpoints";
import Documents from "./Documents";
import Currency from "./Currency";
import UpdateAccount from "../modals/UpdateAccount";
import Country from "./Country";
import Webhooks from "./Webhooks";
import { dateFormatter } from "@/app/utils/dateFormatter";
import SettlementCycle from "./SettlementCycle";
import UpdateLogo from "../modals/UpdateLogo";
import Payout from "./Payout";

const Details = ({ merchant }) => {
  const param = useParams();
  const [successAction, setSuccessAction] = useState(false);
  const [tab, setTabs] = useState(1);
  async function handleTabs(data) {
    setTabs(data);
  }
  const { loading, error, response, getData } = useGetRequest();
  useEffect(() => {
    getData(endPoints.users.merchant + "/" + decryptParams(param.merchantId));
  }, [successAction]);
  // Update Logic
  const [viewUpdateModal, setViewUpdateModal] = useState(false);
  const [viewUpdateLogoModal, setViewUpdateLogoModal] = useState(false);

  const handleUpdateAccount = () => {
    setViewUpdateModal(true);
  };

  // Brand logo get logic
  const {
    getData: getBrandLogo,
    response: brandLogo,
    error: errorBrandLogo,
    loading: loadingBrandLogo,
  } = useGetRequest();

  useEffect(() => {
    getBrandLogo(
      endPoints.users.account.logo +
        "/brandLogo/" +
        decryptParams(param.merchantId),
      true
    );
  }, []);

  const [imgSrc, setImgSrc] = useState();
  useEffect(() => {
    if (brandLogo && !errorBrandLogo) {
      setImgSrc(brandLogo);
    }
  }, [errorBrandLogo, brandLogo]);
  // Component rendering logic
  if (loading)
    return <p className="text-center">Please wait while data is loading</p>;
  if (error)
    return (
      <p className="text-center">
        Error: {error.message || "Error loading data"}
      </p>
    );
  if (response) {
    return (
      <>
        {viewUpdateModal && (
          <UpdateAccount
            onClose={() => setViewUpdateModal(!viewUpdateModal)}
            onSuccess={() => setSuccessAction(!successAction)}
            response={response?.data}
          />
        )}
        {viewUpdateLogoModal && (
          <UpdateLogo
            name={response?.data.fullName}
            id={response?.data.userId}
            onClose={() => setViewUpdateLogoModal(!viewUpdateLogoModal)}
            onSuccess={() => setSuccessAction(!successAction)}
          />
        )}
        <div className={styles.mainCard}>
          <div className="row">
            <div
              className="col-lg-6 col-md-12 col-sm-12"
              style={{ borderRight: "3px dashed gray" }}
            >
              <div className={styles.info}>
                {brandLogo && !errorBrandLogo && (
                  <Image
                    src={imgSrc}
                    alt="profile image"
                    onError={() => setImgSrc(avatar)}
                    width={50}
                    height={50}
                  />
                )}
                <i
                  className="bi bi-pencil-fill"
                  id={styles.editicon}
                  onClick={() => setViewUpdateLogoModal(true)}
                ></i>
                <span className="d-flex flex-column">
                  <h5>
                    {response?.data.fullName}{" "}
                    <i className="bi bi-patch-check-fill text-success"></i>{" "}
                  </h5>

                  <span className={styles.designation}>
                    <span>Merchant</span>
                  </span>
                  <span className={styles.employeeid}>
                    <b>Merchant ID: {response?.data.userId}</b>
                    <span>
                      Registration Date: {response?.data.createdDate || "-"}
                    </span>
                    <span className="text-success">
                      Verification Date:{" "}
                      {response?.data.verificationDate || "Not Verified"}
                    </span>
                  </span>
                </span>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12">
              <div className={styles.detail}>
                <table className="table table-borderless table-sm">
                  <thead className="hidden">
                    <tr>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Phone:</td>
                      <td>{response?.data.contactNumber}</td>
                    </tr>
                    <tr>
                      <td>Email:</td>
                      <td>{response?.data.userId}</td>
                    </tr>
                    <tr>
                      <td>Birthday:</td>
                      <td>
                        {response?.data.dateOfBirth
                          ? dateFormatter(response?.data.dateOfBirth)
                          : "-"}
                      </td>
                    </tr>
                    <tr>
                      <td>Address:</td>
                      <td>{response?.data.addressDetails || "-"}</td>
                    </tr>
                    <tr>
                      <td>Gender:</td>
                      <td>{response?.data.gender || "-"}</td>
                    </tr>
                  </tbody>
                </table>
                <i
                  className="bi bi-pencil-fill"
                  id={styles.editicon}
                  onClick={handleUpdateAccount}
                ></i>
              </div>
            </div>
          </div>
          <Tabs handleTabs={handleTabs} />
        </div>

        {tab === 1 && (
          <Operational
            id={decryptParams(param.merchantId)}
            appId={response?.data.appKey}
            secretId={response?.data.secretKey}
            data={response?.data}
            merchant={merchant}
          />
        )}
        {tab === 2 && (
          <Business
            name={response?.data.fullName}
            id={decryptParams(param.merchantId)}
            role={merchant}
            loginLogo = {response?.data.loginLogo}
            brandLogo={response?.data.brandLogo}
            pageLogo={response?.data.pageLogo}
          />
        )}
        {tab === 3 && (
          <Payin
            name={response?.data.fullName}
            id={decryptParams(param.merchantId)}
          />
        )}
        {tab === 10 && (
          <Payout
            name={response?.data.fullName}
            id={decryptParams(param.merchantId)}
          />
        )}
        {tab === 5 && (
          <Documents
            name={response?.data.fullName}
            id={decryptParams(param.merchantId)}
            role={merchant}
          />
        )}
        {tab === 6 && (
          <Currency
            name={response?.data.fullName}
            id={decryptParams(param.merchantId)}
          />
        )}
        {tab === 7 && (
          <Country
            name={response?.data.fullName}
            id={decryptParams(param.merchantId)}
          />
        )}
        {tab === 8 && (
          <Webhooks
            name={response?.data.fullName}
            id={decryptParams(param.merchantId)}
          />
        )}
        {tab === 9 && (
          <SettlementCycle
            isMerchant={merchant}
            name={response?.data.fullName}
            id={decryptParams(param.merchantId)}
          />
        )}
       
      </>
    );
  }
};

export default Details;
