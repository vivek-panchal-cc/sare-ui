import React from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from "@coreui/react";

//  To display only readable details when status is rejected or approved. (Created by Vivek Panchal)

const KYCDetailsPopup = ({ kycDetail, onClose }) => {
  return (
    <CModal show={true} onClose={onClose}>
      <CModalHeader closeButton>
        <CModalTitle>KYC Details</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p>
          <b>Status :</b>{" "}
          {kycDetail.status.charAt(0).toUpperCase() + kycDetail.status.slice(1)}
        </p>
        <p>
          <b>Comment :</b>{" "}
          {kycDetail.admin_comment}
        </p>
        {/* Add more fields here as needed */}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default KYCDetailsPopup;
