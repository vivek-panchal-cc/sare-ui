import React from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from "@coreui/react";
import { capitalize } from "_helpers";
import "./transactions.css";

const AgentTransactionDetails = ({ transactionDetails, onClose }) => {
  return (
    <CModal show={true} onClose={onClose} className="transaction-modal">
      <CModalHeader closeButton>
        <CModalTitle>Transaction Details</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <table className="agentCustomTable">
          <tbody>
            <tr>
              <td>Reference Id</td>
              <td>
                {transactionDetails.ref_id ? transactionDetails.ref_id : "N/A"}
              </td>
            </tr>
            <tr>
              <td>Transaction Type</td>
              <td>
                {transactionDetails.type ? transactionDetails.type : "N/A"}
              </td>
            </tr>
            <tr>
              <td>Amount</td>
              <td>
                {transactionDetails.amount ? transactionDetails.amount : "N/A"}
              </td>
            </tr>
            <tr>
              <td>Agent Name</td>
              <td>
                {transactionDetails.name ? transactionDetails.name : "N/A"}
              </td>
            </tr>
            <tr>
              <td>Agent Mobile</td>
              <td>
                {transactionDetails.mobile_number
                  ? transactionDetails.mobile_number
                  : "N/A"}
              </td>
            </tr>
            <tr>
              <td>Date Time</td>
              <td>
                {transactionDetails.created_at
                  ? new Date(transactionDetails.created_at).toLocaleDateString(
                      "en-GB"
                    ) +
                    " " +
                    new Date(transactionDetails.created_at).toLocaleTimeString(
                      "en-US"
                    )
                  : "N/A"}
              </td>
            </tr>
            <tr>
              <td>Status</td>
              <td>
                {transactionDetails.status
                  ? capitalize(transactionDetails.status)
                  : "N/A"}
              </td>
            </tr>
            {transactionDetails.status !== "success" && (
              <tr>
                <td>Failure reason</td>
                <td>
                  {transactionDetails.error_reason
                    ? transactionDetails.error_reason
                    : "N/A"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CModalBody>
      <CModalFooter>
        <CButton className="btn btn-danger btn-sm" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default AgentTransactionDetails;
