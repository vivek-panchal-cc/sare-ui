/* eslint-disable jsx-a11y/img-redundant-alt */
import { useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CContainer,
  CTooltip,
  CLink,
  CFormGroup,
  CLabel,
  CInput,
  CSelect,
} from "@coreui/react";
import {
  faSortDown,
  faSortUp,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { capitalize } from "_helpers";
import { globalConstants } from "../../../../constants/admin/global.constants";
import { customerService } from "../../../../services/admin";
import { notify, _canAccess } from "../../../../_helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CustomerTransactionDetails from "./Customer_Transaction_Details";
import "./styles.css";

const CustomerDetailsComponent = (props) => {
  const { customer, customerTransactions } = props;
  const [isTransactionPopupOpen, setTransactionPopupOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const [fields, setFields] = useState({
    pageNo: 1,
    sort_dir: "desc",
    sort_field: "name",
    credit_acc: "",
    ref_id: "",
    status: "",
    from: "",
    to: "",
    totalPage: 1,
  });
  const [sortOrder, setSortOrder] = useState({
    column: null,
    direction: null,
  });
  const [userList, setUserList] = useState([]);
  const [userListFlag, setUserListFlag] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prevFields) => ({ ...prevFields, [name]: value }));
  };

  const seeTransactions = (data) => {
    setTransactionPopupOpen(true);
    setSelectedId(data);
  };

  const getCustomerTransactionsDetails = () => {
    customerService
      .customerTransactionDetails(customer.account_number, fields)
      .then((res) => {
        if (res.success === false) {
          notify.error(res.message);
        } else {
          if (res?.data?.length === 0) {
            setUserList([]);
          } else {
            setUserList(res.data.result);
          }
        }
      });
  };

  const handleSearch = () => {
    getCustomerTransactionsDetails();
    setUserListFlag(true);
  };

  const handleReset = () => {
    setFields({
      pageNo: 1,
      sort_dir: "desc",
      sort_field: "name",
      credit_acc: "",
      ref_id: "",
      status: "",
      from: "",
      to: "",
      totalPage: 1,
    });
    setUserListFlag(false);
    getCustomerTransactionsDetails();
  };

  const sortData = (column) => {
    let direction = "asc";
    if (
      sortOrder.column === column &&
      sortOrder.direction &&
      sortOrder.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortOrder({ column, direction });
  };

  const sortedData =
    customerTransactions &&
    customerTransactions?.length > 0 &&
    sortOrder.column &&
    sortOrder.direction
      ? customerTransactions.sort((a, b) => {
          const columnA = a[sortOrder.column];
          const columnB = b[sortOrder.column];
          if (columnA < columnB) {
            return sortOrder.direction === "asc" ? -1 : 1;
          }
          if (columnA > columnB) {
            return sortOrder.direction === "asc" ? 1 : -1;
          }
          return 0;
        })
      : customerTransactions;

  const renderSortIcon = (column) => {
    if (sortOrder.column === column) {
      if (sortOrder.direction === "asc") {
        return <FontAwesomeIcon icon={faSortUp} />;
      } else {
        return <FontAwesomeIcon icon={faSortDown} />;
      }
    }
    return null;
  };

  return (
    <>
      <CContainer fluid>
        <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <strong>Customer Details</strong>
                <div className="card-header-actions">
                  <CTooltip content={globalConstants.BACK_MSG}>
                    <CLink
                      className="btn btn-danger btn-sm"
                      aria-current="page"
                      to="/admin/customers"
                    >
                      {" "}
                      <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
                      Back
                    </CLink>
                  </CTooltip>
                </div>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol sm="12">
                    <table className="customTable">
                      <tbody>
                        <tr>
                          <td>
                            <b>Account Number</b>
                          </td>
                          <td>
                            {customer.account_number
                              ? customer.account_number
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>Name</b>
                          </td>
                          <td>{customer.name ? customer.name : "N/A"}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>Mobile Number</b>
                          </td>
                          <td>
                            {customer.mobile_number
                              ? customer.mobile_number
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>National ID</b>
                          </td>
                          <td>
                            {customer.national_id
                              ? customer.national_id
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>SHOFCO Number</b>
                          </td>
                          <td>
                            {customer.shofco_number
                              ? customer.shofco_number
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>Customer Type</b>
                          </td>
                          <td>
                            {customer.customer_type
                              ? customer.customer_type === "individual"
                                ? "Individual"
                                : customer.customer_type === "business"
                                ? "Business"
                                : "Agent"
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>Status</b>
                          </td>
                          <td>
                            {customer.status
                              ? customer.status === "0"
                                ? "Deactive"
                                : "Active"
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>KYC Token</b>
                          </td>
                          <td>
                            {customer.kycId ? (
                              <a
                                href={`/admin/kyc_requests/detailview/${customer.kycId}`}
                              >
                                {customer.kyc_token}
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>KYC Status</b>
                          </td>
                          <td>
                            {customer.kyc_status
                              ? (() => {
                                  switch (customer.kyc_status) {
                                    case "pending_approval":
                                      return "Pending Approval";
                                    case "pending":
                                      return "Pending";
                                    case "approved":
                                      return "Approved";
                                    case "rejected":
                                      return "Rejected";
                                    default:
                                      return "N/A";
                                  }
                                })()
                              : "N/A"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>

            <CRow>
              <CCol xl={12}>
                <CCard>
                  <CCardHeader>
                    <strong>Transactions</strong>
                  </CCardHeader>
                  <CCardBody>
                    <CRow>
                      <CCol xl={2}>
                        <CFormGroup row>
                          <CCol xs="12">
                            <CLabel htmlFor="ref_id">Reference Id</CLabel>
                            <CInput
                              id="ref_id"
                              placeholder="Search Reference Id"
                              name="ref_id"
                              value={fields.ref_id}
                              onChange={handleChange}
                              onKeyPress={(event) => {
                                if (event.key === "Enter") {
                                  handleSearch();
                                }
                              }}
                            />
                          </CCol>
                        </CFormGroup>
                      </CCol>
                      <CCol xl={2}>
                        <CFormGroup row>
                          <CCol xs="12">
                            <CLabel htmlFor="credit_acc">Account Number</CLabel>
                            <CInput
                              id="credit_acc"
                              placeholder="Search Account Number"
                              name="credit_acc"
                              value={fields.credit_acc}
                              onChange={handleChange}
                              onKeyPress={(event) => {
                                if (event.key === "Enter") {
                                  handleSearch();
                                }
                              }}
                            />
                          </CCol>
                        </CFormGroup>
                      </CCol>
                      <CCol xl={2}>
                        <CFormGroup row>
                          <CCol xs="12">
                            <CLabel htmlFor="from">From Date</CLabel>
                            <CInput
                              type="date"
                              id="from"
                              name="from"
                              value={fields.from}
                              onChange={handleChange}
                              style={{ cursor: "pointer" }}
                              onKeyPress={(event) => {
                                if (event.key === "Enter") {
                                  handleSearch();
                                }
                              }}
                            />
                          </CCol>
                        </CFormGroup>
                      </CCol>
                      <CCol xl={2}>
                        <CFormGroup row>
                          <CCol xs="12">
                            <CLabel htmlFor="to">To Date</CLabel>
                            <CInput
                              type="date"
                              id="to"
                              name="to"
                              value={fields.to}
                              onChange={handleChange}
                              style={{ cursor: "pointer" }}
                              onKeyPress={(event) => {
                                if (event.key === "Enter") {
                                  handleSearch();
                                }
                              }}
                            />
                          </CCol>
                        </CFormGroup>
                      </CCol>
                      <CCol xl={2}>
                        <CFormGroup row>
                          <CCol xs="12">
                            <CLabel htmlFor="status">Status</CLabel>
                            <CSelect
                              id="status"
                              placeholder="Status"
                              name="status"
                              value={fields.status}
                              onChange={handleChange}
                              style={{ cursor: "pointer" }}
                              onKeyPress={(event) => {
                                if (event.key === "Enter") {
                                  handleSearch();
                                }
                              }}
                            >
                              <option value="">-- Select Status --</option>
                              <option value="success">Success</option>
                              <option value="fail">Fail</option>
                            </CSelect>
                          </CCol>
                        </CFormGroup>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol xl={12}>
                        <CFormGroup row>
                          <CCol xs="1">
                            <button
                              className="btn btn-dark btn-md"
                              onClick={handleSearch}
                            >
                              Search
                            </button>
                          </CCol>
                          <CCol xs="2">
                            <button
                              className="btn btn-dark btn-md"
                              onClick={handleReset}
                            >
                              Clear
                            </button>
                          </CCol>
                        </CFormGroup>
                      </CCol>
                    </CRow>
                  </CCardBody>
                  {/* <CCardHeader>
                    <h5>Transactions</h5>
                  </CCardHeader> */}
                  <CCardBody>
                    <div className="position-relative table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th
                              onClick={() => sortData("ref_id")}
                              style={{ cursor: "pointer" }}
                            >
                              Reference Id {renderSortIcon("ref_id")}
                            </th>
                            <th
                              onClick={() => sortData("credit_acc")}
                              style={{ cursor: "pointer" }}
                            >
                              Account Number {renderSortIcon("credit_acc")}
                            </th>
                            <th
                              onClick={() => sortData("amount")}
                              style={{ cursor: "pointer" }}
                            >
                              Amount {renderSortIcon("amount")}
                            </th>
                            <th
                              onClick={() => sortData("created_at")}
                              style={{ cursor: "pointer" }}
                            >
                              Transaction Date {renderSortIcon("created_at")}
                            </th>
                            <th
                              onClick={() => sortData("status")}
                              style={{ cursor: "pointer" }}
                            >
                              Status {renderSortIcon("status")}
                            </th>
                            {(_canAccess("customers", "update") ||
                              _canAccess("customers", "delete")) && (
                              <>
                                <th>Action</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {isTransactionPopupOpen && (
                            <CustomerTransactionDetails
                              transactionDetails={selectedId}
                              onClose={() => setTransactionPopupOpen(false)}
                            />
                          )}
                          {userListFlag ? (
                            userList?.length > 0 ? (
                              userList?.map((data) => (
                                <tr key={data.id}>
                                  <td>{data.ref_id}</td>
                                  <td>{data.credit_acc}</td>
                                  <td>{data.amount}</td>
                                  <td>
                                    {new Date(
                                      data.created_at
                                    ).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    })}{" "}
                                    {new Date(
                                      data.created_at
                                    ).toLocaleTimeString("en-US")}
                                  </td>
                                  <td>{capitalize(data.status)}</td>
                                  {_canAccess("customers", "update") && (
                                    <>
                                      <td>
                                        {_canAccess("customers", "update") && (
                                          <CTooltip
                                            content={
                                              globalConstants.Details_BTN
                                            }
                                          >
                                            <CLink
                                              className="btn  btn-md btn-primary"
                                              aria-current="page"
                                              onClick={() =>
                                                seeTransactions(data)
                                              }
                                            >
                                              <FontAwesomeIcon icon={faEye} />
                                            </CLink>
                                          </CTooltip>
                                        )}
                                      </td>
                                    </>
                                  )}
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="5">No records found</td>
                              </tr>
                            )
                          ) : sortedData?.length > 0 ? (
                            sortedData?.map((data) => (
                              <tr key={data.id}>
                                <td>{data.ref_id}</td>
                                <td>{data.credit_acc}</td>
                                <td>{data.amount}</td>
                                <td>
                                  {new Date(data.created_at).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    }
                                  )}{" "}
                                  {new Date(data.created_at).toLocaleTimeString(
                                    "en-US"
                                  )}
                                </td>
                                <td>{capitalize(data.status)}</td>
                                {_canAccess("customers", "update") && (
                                  <>
                                    <td>
                                      {_canAccess("customers", "update") && (
                                        <CTooltip
                                          content={globalConstants.Details_BTN}
                                        >
                                          <CLink
                                            className="btn  btn-md btn-primary"
                                            aria-current="page"
                                            onClick={() =>
                                              seeTransactions(data)
                                            }
                                          >
                                            <FontAwesomeIcon icon={faEye} />
                                          </CLink>
                                        </CTooltip>
                                      )}
                                    </td>
                                  </>
                                )}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="3">No records found</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CCol>
        </CRow>
      </CContainer>
    </>
  );
};

export default CustomerDetailsComponent;
