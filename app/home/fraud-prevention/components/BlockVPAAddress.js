import { useEffect, useState } from "react";
import usePostRequest from "@/app/hooks/usePost";
import { endPoints } from "@/app/services/apiEndpoints";
import useDeleteRequest from "@/app/hooks/useDelete";
import { loadingMsg } from "@/app/utils/message";
import Headings from "./Headings";
import Table from "@/app/ui/table/Table";
import { blockVPAAddr } from "./Columns";
import AddVPAAddr from "../modals/AddVPAAddr";

const BodyMapping = ({ data = [], loading, successAction }) => {
  const { response, error, deleteData } = useDeleteRequest();

  async function handleDelete(id) {
    await deleteData(endPoints.fraudPrevention.addNew + "/" + id);
  }
  useEffect(() => {
    if (response && !error) {
      successAction();
    }
  }, [response, error]);
  return (
    <tbody>
      {!loading ? (
        <tr>
          <td colSpan={2} className="text-center">
            {loadingMsg("VPA address")}
          </td>
        </tr>
      ) : (
        <>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.userId}>
                <td>{item.value} </td>
                <td>
                  <i
                    className="bi bi-trash-fill text-danger"
                    onClick={() => handleDelete(item.fraudPreventionId)}
                  ></i>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="text-center">
                No vpa address set
              </td>
            </tr>
          )}
        </>
      )}
    </tbody>
  );
};

export default function BlockedVPA({ type, userId, name }) {
  const [successAction, setSuccessAction] = useState(null);
  const { loading, postData, error, response } = usePostRequest(
    endPoints.fraudPrevention.userAndType
  );

  async function getAllVpa() {
    await postData({
      type: type,
      userId: userId,
    });
  }

  useEffect(() => {
    getAllVpa();
  }, [successAction, userId]);

  const [viewAddModal, setViewAddModal] = useState(false);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (loading) setLoader(true);
  }, [loading]);
  if (error) return <p>Failed to fetch data</p>;
  return (
    <>
      {viewAddModal && (
        <AddVPAAddr
          type={type}
          id={userId}
          merchant={name}
          onSuccess={() => setSuccessAction(!successAction)}
          onClose={() => setViewAddModal(!viewAddModal)}
        />
      )}
      <Headings
        title="Blocked VPA Address"
        action={() => setViewAddModal(true)}
      />

      <Table
        headers={blockVPAAddr}
        download={false}
        search={false}
        pagination={false}
      >
        <BodyMapping
          data={response?.data.data || null}
          loading={loader}
          successAction={() => setSuccessAction(!successAction)}
        />
      </Table>
    </>
  );
}
