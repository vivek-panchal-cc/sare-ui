/* eslint-disable jsx-a11y/img-redundant-alt */
import { useState } from "react";
import moment from "moment";
import { capitalize } from "_helpers";
// import "./page.css";
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
import CIcon from "@coreui/icons-react";
import {
  faSort,
  faSortDown,
  faSortUp,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom";
import { agentService } from "../../../../services/admin";
import { notify, history, _loginUsersDetails } from "../../../../_helpers";
import { globalConstants } from "../../../../constants/admin/global.constants";
import FileSaver, { saveAs } from "file-saver";

const AgentDetailsComponent = (props) => {
  const { account_number } = useParams();
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
//   const [sortedData, setSortedData] = useState([]);
  const [userList, setUserList] = useState([]);
  const [userListFlag, setUserListFlag] = useState(false);
  const [multiaction, setMultiaction] = useState([]);

  const handleMultiAction = (userId) => {
    const updatedMultiaction = { ...multiaction };
    updatedMultiaction[userId] = !updatedMultiaction[userId];
    setMultiaction(updatedMultiaction);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prevFields) => ({ ...prevFields, [name]: value }));
  };

  const getAgentDetailsView = () => {
    agentService
      .agentDetailsView(props.agent.account_number, fields)
      .then((res) => {
        if (res.success === false) {
          notify.error(res.message);
        } else {
            // setUserList(res.data.result);
            if (res?.data?.length === 0) {
                setUserList([]);
            } else {
                setUserList(res.data.result);
            }
            // setUserListFlag(true);          
        }
      });
  };

  const handleSearch = () => {
    getAgentDetailsView(props.agent.account_number);
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
    getAgentDetailsView(props.agent.account_number);
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
    props.agentDetails &&
    props.agentDetails?.length > 0 &&
    sortOrder.column &&
    sortOrder.direction
      ? props.agentDetails.sort((a, b) => {
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
      : props.agentDetails;

    //   setSortedData(sortedDataList);

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
console.log("userListFlag", userListFlag)
  return (
    <>
      <CContainer fluid>
        <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <h5>Agent Details</h5>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol sm="12">
                    <b>Account Number :</b> {props.agent.account_number}
                    <br />
                    <b>Name :</b> {props.agent.name}
                    <br />
                    <b>Mobile Number :</b> {props.agent.mobile_number}
                    <br />
                    <b>National Id :</b> {props.agent.nation_id}
                    <br />
                    <b>SHOFCO Number :</b> {props.agent.shofco_number}
                  </CCol>
                  <CCol sm="12">
                    {/* <b>Customer Type :</b> {props.agent.customer_type} */}
                    <b>Status :</b>{" "}
                    {props.agent.status === "0" ? "Deactive" : "Active"}
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>

            <CRow>
              <CCol xl={12}>
                <CCard>
                  <CCardHeader>
                    <h5>Transactions</h5>
                  </CCardHeader>
                  <CCardBody>
                    <CRow>
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
                                  handleSearch("search");
                                }
                              }}
                            />
                          </CCol>
                        </CFormGroup>
                      </CCol>
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
                                  handleSearch("search");
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
                                  handleSearch("search");
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
                                  handleSearch("search");
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
                                  handleSearch("search");
                                }
                              }}
                            />
                          </CCol>
                        </CFormGroup>
                      </CCol>

                      <CCol xl={2}>
                        <CFormGroup row>
                          <CCol xs="12"></CCol>
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
                              onClick={() => sortData("credit_acc")}
                              style={{ cursor: "pointer" }}
                            >
                              Account Number {renderSortIcon("credit_acc")}
                            </th>
                            <th
                              onClick={() => sortData("ref_id")}
                              style={{ cursor: "pointer" }}
                            >
                              Reference Id {renderSortIcon("ref_id")}
                            </th>
                            <th
                              onClick={() => sortData("amount")}
                              style={{ cursor: "pointer" }}
                            >
                              Amount {renderSortIcon("amount")}
                            </th>
                            <th
                              onClick={() => sortData("status")}
                              style={{ cursor: "pointer" }}
                            >
                              Status {renderSortIcon("status")}
                            </th>
                            <th
                              onClick={() => sortData("created_at")}
                              style={{ cursor: "pointer" }}
                            >
                              Transaction Date {renderSortIcon("created_at")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {userListFlag  ? (
                            userList?.map((data, index) => (
                              <tr key={index}>
                                <td>{data.credit_acc}</td>
                                <td>{data.ref_id}</td>
                                <td>{data.amount}</td>
                                <td>{capitalize(data.status)}</td>
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
                              </tr>
                            ))
                          ) : sortedData?.length > 0 ? (
                            sortedData?.map((data, index) => (
                              <tr key={index}>
                                <td>{data.credit_acc}</td>
                                <td>{data.ref_id}</td>
                                <td>{data.amount}</td>
                                <td>{capitalize(data.status)}</td>
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

export default AgentDetailsComponent;
