"use client";
import { headers } from "./Columns";
import { useEffect, useState } from "react";
import { endPoints } from "@/app/services/apiEndpoints";
import Table from "@/app/ui/table/Table";
import { queryStringWithKeyword } from "@/app/services/queryString";
import { useRouter } from "next/navigation";
import { encryptParams } from "@/app/utils/encryptions";
import usePostRequest from "@/app/hooks/usePost";
import { loadingMsg } from "@/app/utils/message";
import { dateFormatter } from "@/app/utils/dateFormatter";

const BodyMapping = ({ data = [], loading }) => {
  const router = useRouter();
  const handleProfileClick = (userId) => {
    router.push(`/home/user-management/merchants/${encryptParams(userId)}`);
  };
  return (
    <tbody>
      {!loading ? (
        <tr>
          <td colSpan={9} className="text-center">
            {loadingMsg("merchant")}
          </td>
        </tr>
      ) : (
        <>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.userId}>
                <td className="actions">
                  <span className="d-flex gap-3">
                    <i
                      className="bi bi-pencil-square text-primary"
                      title="Edit"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleProfileClick(item.userId)}
                    ></i>
                  </span>
                </td>
                <td>{item.appId || "NA"}</td>
                <td>{item.fullName}</td>
                <td>{item.businessName}</td>
                <td>{item.userId}</td>
                <td>{item.contactNumber}</td>
                <td>
                  {item.createdDate ? dateFormatter(item.createdDate) : "NA"}
                </td>
                <td>
                  {item.verificationDate
                    ? dateFormatter(item.verificationDate)
                    : "NA"}
                </td>
                <td>{item.status || "NA"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="text-center">
                No Merchant Available
              </td>
            </tr>
          )}
        </>
      )}
    </tbody>
  );
};

const MerchantList = () => {
  const [currentPage, setCurrentPage] = useState(0);

  // handling search keyword
  const [keyword, setKeyword] = useState("");
  const handleKeyword = (e) => setKeyword(e.target.value);
  const {
    loading,
    error,
    response = [],
    postData,
  } = usePostRequest(endPoints.users.allMerchantList);
  useEffect(() => {
    postData(
      queryStringWithKeyword(
        currentPage,
        process.env.NEXT_PUBLIC_PAGINATION_SIZE,
        keyword
      )
    );
  }, [currentPage, keyword]);

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
        // totalPages={response.totalPage}
        pageSize={response?.data.pageSize || 0}
        totalElement={response?.data.totalElement || null}
        handleNext={handleNext}
        handlePrev={handlePrev}
        link="/home/user-management/merchants/add-merchant"
        download={false}
        onChange={handleKeyword}
      >
        <BodyMapping data={response?.data.data || null} loading={loader} />
      </Table>
    </div>
  );
};

export default MerchantList;
