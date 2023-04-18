/* eslint-disable jsx-a11y/img-redundant-alt */
import { useState } from "react";
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
import { agentService } from "../../../../services/admin";
import { notify, history, _loginUsersDetails } from "../../../../_helpers";
import { globalConstants } from "../../../../constants/admin/global.constants";
import FileSaver, { saveAs } from "file-saver";

const AgentDetailsComponent = (props) => {
  const [fields, setFields] = useState({
    pageNo: 1,
    sort_dir: "desc",
    sort_field: "name",
    credit_acc: "",
    ref_id: "",
    status: "",
    fromDate: "",
    toDate: "",
    totalPage: 1,
  });
  const [sortOrder, setSortOrder] = useState({
    column: null,
    direction: null,
  });
  const [userList, setUserList] = useState([]);
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

  //   const getAgentDetailsView = () => {
  //     agentService.agentDetailsView(fields).then((res) => {
  //       if (res.success === false) {
  //         notify.error(res.message);
  //         history.push("/admin/agents");
  //       } else {
  //         setFields(res.data.result);
  //       }
  //     });
  //   };

  const getAgentDetailsView = () => {
    agentService.agentDetailsView(fields).then((res) => {
      if (res.success === false) {
        notify.error(res.message);
      } else {
        setFields((prevFields) => ({
          ...prevFields,
          totalPage: res?.data?.totalPage,
        }));
        setUserList(res.data.result);

        /* Multi delete checkbox code */
        if (res?.data?.result?.length > 0) {
          let users = res.data.result;
          let updatedMultiaction = { ...multiaction };
          const currentUser = _loginUsersDetails();
          for (var key in users) {
            if (
              globalConstants.DEVELOPER_PERMISSION_USER_ID.indexOf(
                users[key].customer_account_rel?.account_number
              ) > -1
            ) {
              continue;
            }
            if (
              currentUser.user_group_id ===
              users[key].customer_account_rel?.account_number
            ) {
              continue;
            }
            updatedMultiaction[
              users[key].customer_account_rel?.account_number
            ] = false;
          }
          setMultiaction(updatedMultiaction);
        } else if (res?.data?.result?.length === 0) {
          setMultiaction([]);
        }
      }
    });
  };

  const handleSearch = () => {
    getAgentDetailsView(fields);
  };

  const handleReset = () => {
    setFields({
      pageNo: 1,
      sort_dir: "desc",
      sort_field: "name",
      credit_acc: "",
      ref_id: "",
      status: "",
      totalPage: 1,
    });
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
    props.agentDetails.length > 0 &&
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
                    <b>Shofco Number :</b> {props.agent.shofco_number}
                  </CCol>
                  <CCol sm="12">
                    {/* <b>Customer Type :</b> {props.agent.customer_type} */}
                    <b>Status :</b>{" "}
                    {props.agent.status === "0" ? "De-active" : "Active"}
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
                            <CLabel htmlFor="fromDate">From Date</CLabel>
                            <CInput
                              type="date"
                              id="fromDate"
                              name="fromDate"
                              value={fields.fromDate}
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
                            <CLabel htmlFor="toDate">To Date</CLabel>
                            <CInput
                              type="date"
                              id="toDate"
                              name="toDate"
                              value={fields.toDate}
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
                          {sortedData?.length > 0 ? (
                            sortedData.map((data, index) => (
                              <tr key={index}>
                                <td>{data.credit_acc}</td>
                                <td>{data.ref_id}</td>
                                <td>{data.amount}</td>
                                <td>{capitalize(data.status)}</td>
                                <td>
                                  {new Date(data.created_at).toLocaleDateString(
                                    "en-GB"
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
