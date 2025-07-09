"use client";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import { queryStringWithKeyword } from "@/app/services/queryString";
import Table from "@/app/ui/table/Table";
import React, { useEffect, useState } from "react";
import { headers } from "./Columns";
import { loadingMsg } from "@/app/utils/message";
import ViewPermissions from "../modals/ViewPermissions";
const BodyMapping = ({ data = [], loading, successAction }) => {
  const [viewPermission, setViewPermission] = useState(false);
  const [user, setUser] = useState(null);

  const handleViewPermissions = (data) => {
    setUser(data);
    setViewPermission(true);
  };
  return (
    <>
      {viewPermission && (
        <ViewPermissions
          data={user}
          onSuccess={() => successAction()}
          onClose={() => setViewPermission(!viewPermission)}
        />
      )}
      <tbody>
        {!loading ? (
          <tr>
            <td colSpan={5} className="text-center">
              {loadingMsg("sub merchants")}
            </td>
          </tr>
        ) : (
          <>
            {data && data.length > 0 ? (
              data.map((item) => (
                <tr key={item.userId | "NA"}>
                  <td>{item.fullName || "NA"}</td>
                  <td>{item.userId || "NA"}</td>
                  <td>{item.contactNumber || "NA"}</td>
                  <td>{item.appKey || "NA"}</td>
                  <td>
                    <i
                      className="bi bi-list-check"
                      onClick={() => {
                        handleViewPermissions(item);
                      }}
                    ></i>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  No Sub Merchant Available
                </td>
              </tr>
            )}
          </>
        )}
      </tbody>
    </>
  );
};
const SubMerchantList = ({ role }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const handleKeyword = (e) => setKeyword(e.target.value);
  const [successAction, setSuccessAction] = useState(false);
  const {
    loading,
    error,
    response = [],
    postData,
  } = usePostRequest(endPoints.settings.allSubMerchant);
  useEffect(() => {
    postData(
      queryStringWithKeyword(
        currentPage,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        keyword
      )
    );
  }, [currentPage, keyword, successAction]);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (loading) setLoader(true);
  }, [loading]);
  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };
  if (error)
    return (
      <p className="text-center">
        Error: {error.message || "Something went wrong"}
      </p>
    );
  return (
    <div className="wrapper">
      <Table
        headers={headers}
        currentPage={response?.data.pageNumber || 0}
        pageSize={response?.data.pageSize || 0}
        totalElement={response?.data.totalElement || null}
        handleNext={handleNext}
        handlePrev={handlePrev}
        link={role && "/home/team/sub-merchants/add-sub-merchant"}
        onChange={handleKeyword}
        download={false}
      >
        <BodyMapping
          data={response?.data.data || null}
          loading={loader}
          successAction={() => setSuccessAction(!successAction)}
        />
      </Table>
    </div>
  );
};

export default SubMerchantList;
