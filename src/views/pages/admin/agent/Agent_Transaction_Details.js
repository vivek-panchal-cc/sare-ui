import React from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from "@coreui/react";

const AgentTransactionDetails = ({ transactionDetails, onClose }) => {
  return (
    <CModal show={true} onClose={onClose}>
      <CModalHeader closeButton>
        <CModalTitle>Transaction Details</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p>
          <b>Status :</b>{" "}
          {transactionDetails.credit_acc}
        </p>
        <p>
          <b>Comment :</b>
        </p>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default AgentTransactionDetails;
