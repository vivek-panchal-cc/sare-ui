import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "reactstrap";
import { kycService } from "../../../../services/frontend/kyc.service";
import { useParams, useHistory } from "react-router-dom";
import { notify, setLoading } from "../../../../_helpers/index";
import logo from "../img/logo.svg";
import view from "../img/view.svg";
import kycComplete from "../img/complete.svg";
import uploadKYC from "../img/upload.svg";
import "../css/styles.css";
import { flagSet } from "@coreui/icons";

const KycForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [homeAddress, setHomeAddress] = useState({
    houseNumber: "",
    streetName: "",
    landmark: "",
    city: "",
    pincode: "",
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [idExpirationDate, setIdExpirationDate] = useState("");
  const [idFile, setIdFile] = useState(null);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData1, setFormData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const { mobile, secret_key } = useParams();
  const history = useHistory();

  let formData = new FormData();

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    if (!validateEmail(emailValue)) {
      setError(2);
    } else {
      setError(0);
    }
  };

  const handleHomeAddressChange = (e) => {
    setHomeAddress({
      ...homeAddress,
      [e.target.name]: e.target.value,
    });
  };

  const validatePhoneNumber = (phoneNumber) => {
    const regex = /^(\+254|0)[1-9]\d{8}$/;
    return regex.test(phoneNumber);
  };

  const handlePhoneNumberChange = (e) => {
    const { value } = e.target;
    setPhoneNumber(value);
    if (!validatePhoneNumber(value)) {
      setPhoneNumberError("Please enter a valid phone number");
    } else {
      setPhoneNumberError("");
    }
  };

  const handleIdNumberChange = (e) => {
    setIdNumber(e.target.value);
  };

  const handleIdExpirationDateChange = (e) => {
    setIdExpirationDate(e.target.value);
  };

  // const handleIdFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file && file.type === "application/pdf") {
  //     setIdFile(file);
  //     formData.append("file", file, "test.pdf");
  //     setFormData(file);
  //   } else {
  //     console.log("Invalid file format.");
  //   }
  // };

  const handleDownloadPdf = (event) => {
    event.stopPropagation();
    if (idFile && idFile.type === "application/pdf") {
      const url = URL.createObjectURL(idFile);
      const a = document.createElement("a");
      a.href = url;
      a.download = "file.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      console.log("Invalid file format.");
    }
  };

  const handleIdFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setIdFile(URL.createObjectURL(file));
      formData.append("file", file, "test.jpeg");
      setFormData(file);
    } else if (file && file.type === "application/pdf") {
      setIdFile(file);
      formData.append("file", file, "test.pdf");
      setFormData(file);
    } else {
      console.log("Invalid file format.");
    }
  };

  const handleFileClick = (e) => {
    console.log("Clicked");
    const imgSrc = e.target.getAttribute("src");
    setSelectedImageFile(imgSrc);
    setShowModal(true);
  };

  const handleSubmit = () => {
    // submitKYCDetails();
    console.clear();
    console.log("handleSubmit");
    if (!fullName) {
      setError(1);
    } else if (!email) {
      setError(2);
    } else if (!homeAddress.houseNumber) {
      setError(3);
    } else if (!homeAddress.streetName) {
      setError(4);
    } else if (!homeAddress.landmark) {
      setError(5);
    } else if (!homeAddress.city) {
      setError(6);
    } else if (!homeAddress.pincode) {
      setError(7);
    } else if (!phoneNumber) {
      setError(8);
    } else if (!formData1) {
      setError(9);
    } else if (!idNumber) {
      setError(10);
    } else if (!idExpirationDate) {
      setError(11);
    } else {
      setLoading(false);
      setEditing(true);
    }
  };

  const submitKYCDetails = async () => {
    console.log("submitKYCDetails");
    setLoading(true);
    if (!fullName) {
      setError(1);
    } else if (!email) {
      setError(2);
    } else if (!homeAddress.houseNumber) {
      setError(3);
    } else if (!homeAddress.streetName) {
      setError(4);
    } else if (!homeAddress.landmark) {
      setError(5);
    } else if (!homeAddress.city) {
      setError(6);
    } else if (!homeAddress.pincode) {
      setError(7);
    } else if (!phoneNumber) {
      setError(8);
    } else if (!formData1) {
      setError(9);
    } else if (!idNumber) {
      setError(10);
    } else if (!idExpirationDate) {
      setError(11);
    } else {
      setLoading(true);
      setEditing(true);
      // let formData = new FormData();
      formData.append("kyc_token", mobile);
      formData.append("mobile_key", secret_key);
      formData.append("name", fullName);
      formData.append("email", email);
      formData.append("house_number", homeAddress.houseNumber);
      formData.append("street_name", homeAddress.streetName);
      formData.append("landmark", homeAddress.landmark);
      formData.append("city", homeAddress.city);
      formData.append("pincode", homeAddress.pincode);
      formData.append("phone_number", phoneNumber);
      formData.append("file", formData1);
      formData.append("id_number", idNumber);
      formData.append("id_expiration_date", idExpirationDate);

      const obj = {
        kyc_token: mobile,
        mobile_key: secret_key,
        name: fullName,
        email: email,
        house_number: homeAddress.houseNumber,
        street_name: homeAddress.streetName,
        landmark: homeAddress.landmark,
        city: homeAddress.city,
        pincode: homeAddress.pincode,
        phone_number: phoneNumber,
        id_number: idNumber,
        id_expiration_date: idExpirationDate,
      };
      console.log("ReqData", formData);
      kycService.store(formData).then((res) => {
        if (res.success === false) {
          setLoading(true);
          // history.push("/kyc/failure");
          notify.error(res.message);
          setLoading(false);
        } else {
          if (res.success) {
            setLoading(true);
            notify.success(res.message);
            history.push("/kyc/recieved");
            setLoading(false);
          } else {
            // notify.warning(res.message);
          }
        }
        setLoading(false);
      });

      /* let response = await fetch(
        "http://192.168.1.32/SARE/customer-onboard/public/kyc/store",
        {
          method: "POST",
          body: formData,
          // headers: {
          //   "Content Type": "multipart/form-data",
          // },
        }
      );
      console.log("response", response);
      return response; */
    }
  };

  return (
    <>
      <Container>
        <Form>
          <section className="main-section">
            <div className="container">
              <div className="logo-part text-center">
                <img src={logo} alt="logo" className="mes-img"></img>
              </div>
              <div className="box text-center">
                <CardBody>
                  <CardTitle className="kyc-form-sub-heading">
                    <b>Enter KYC Details</b>
                  </CardTitle>
                  <Form className="form-group">
                    <FormGroup>
                      <Label>Full Name</Label>
                      <Input
                        type="text"
                        name="full_name"
                        value={fullName}
                        onChange={handleFullNameChange}
                        placeholder="Full Name"
                        disabled={editing}
                      />
                      {error == 1 ? (
                        <span
                          className="font-recia"
                          style={{
                            color: "#f00",
                            fontSize: "14px",
                            marginTop: "6px",
                            display: "block",
                          }}
                        >
                          Full Name is required
                        </span>
                      ) : null}
                    </FormGroup>
                    <FormGroup>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Email"
                        disabled={editing}
                      />
                      {error === 2 ? (
                        <span
                          className="font-recia"
                          style={{
                            color: "#f00",
                            fontSize: "14px",
                            marginTop: "6px",
                            display: "block",
                          }}
                        >
                          Email is not in the correct format (eg. abc@abc.com)
                        </span>
                      ) : null}
                    </FormGroup>
                    <FormGroup>
                      <Label>Home Address</Label>
                      <Input
                        style={{ marginBottom: "10px" }}
                        type="text"
                        name="houseNumber"
                        value={homeAddress.houseNumber}
                        onChange={handleHomeAddressChange}
                        placeholder="House Number"
                        disabled={editing}
                      />
                      {error == 3 ? (
                        <span
                          className="font-recia"
                          style={{
                            color: "#f00",
                            fontSize: "14px",
                            marginTop: "6px",
                            display: "block",
                          }}
                        >
                          House Number is required
                        </span>
                      ) : null}
                      <Input
                        style={{ marginBottom: "10px" }}
                        type="text"
                        name="streetName"
                        value={homeAddress.streetName}
                        onChange={handleHomeAddressChange}
                        placeholder="Street Name"
                        disabled={editing}
                      />
                      {error == 4 ? (
                        <span
                          className="font-recia"
                          style={{
                            color: "#f00",
                            fontSize: "14px",
                            marginTop: "6px",
                            display: "block",
                          }}
                        >
                          Street Name is required
                        </span>
                      ) : null}
                      <Input
                        style={{ marginBottom: "10px" }}
                        type="text"
                        name="landmark"
                        value={homeAddress.landmark}
                        onChange={handleHomeAddressChange}
                        placeholder="Landmark"
                        disabled={editing}
                      />
                      {error == 5 ? (
                        <span
                          className="font-recia"
                          style={{
                            color: "#f00",
                            fontSize: "14px",
                            marginTop: "6px",
                            display: "block",
                          }}
                        >
                          Landmark is required
                        </span>
                      ) : null}
                      <Input
                        style={{ marginBottom: "10px" }}
                        type="text"
                        name="city"
                        value={homeAddress.city}
                        onChange={handleHomeAddressChange}
                        placeholder="City"
                        disabled={editing}
                      />
                      {error == 6 ? (
                        <span
                          className="font-recia"
                          style={{
                            color: "#f00",
                            fontSize: "14px",
                            marginTop: "6px",
                            display: "block",
                          }}
                        >
                          City is required
                        </span>
                      ) : null}
                      <Input
                        type="number"
                        name="pincode"
                        value={homeAddress.pincode}
                        onChange={handleHomeAddressChange}
                        placeholder="Pincode"
                        disabled={editing}
                      />
                      {error == 7 ? (
                        <span
                          className="font-recia"
                          style={{
                            color: "#f00",
                            fontSize: "14px",
                            marginTop: "6px",
                            display: "block",
                          }}
                        >
                          PinCode is required
                        </span>
                      ) : null}
                    </FormGroup>
                    <FormGroup>
                      <Label>Phone Number</Label>
                      <Input
                        type="text"
                        name="phone_number"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        placeholder="Phone Number"
                        disabled={editing}
                      />
                      {phoneNumberError && (
                        <span className="text-danger">{phoneNumberError}</span>
                      )}
                      {error == 8 ? (
                        <span
                          className="font-recia"
                          style={{
                            color: "#f00",
                            fontSize: "14px",
                            marginTop: "6px",
                            display: "block",
                          }}
                        >
                          Phone Number is required
                        </span>
                      ) : null}
                    </FormGroup>
                    <FormGroup>
                      <Label for="idFile">Copy of ID</Label>
                      <div className="file-upload-design position-relative">
                        <div className="upload-part">
                          {idFile ? (
                            <div>
                              {typeof idFile === "string" ? (
                                <>
                                  {/* <p alt="view" className="view-img">
                                    <img
                                      onClick={handleFileClick}
                                      src={view}
                                      alt="view"
                                    ></img>
                                  </p> */}
                                  <img
                                    src={idFile}
                                    alt="uploaded id"
                                    style={{ cursor: "pointer" }}
                                  />
                                </>
                              ) : (
                                <a href="#" onClick={(event) => handleDownloadPdf(event)}                                >
                                  <strong>PDF Uploaded</strong>
                                </a>
                              )}
                            </div>
                          ) : (
                            <>
                              <img
                                src={uploadKYC}
                                alt="upload"
                                className="upload-svg"
                              />
                              <strong>Upload</strong>
                            </>
                          )}
                          <Input
                            type="file"
                            name="idFile"
                            id="idFile"
                            accept="image/*, application/pdf"
                            onChange={handleIdFileChange}
                            disabled={editing}
                          />
                          {error == 9 ? (
                            <div className="error-message">
                              <span
                                className="font-recia"
                                style={{ color: "#f00", fontSize: "14px" }}
                              >
                                File is required
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </FormGroup>
                    <Modal
                      isOpen={showModal}
                      toggle={() => setShowModal(false)}
                    >
                      <ModalHeader toggle={() => setShowModal(false)}>
                        Image Preview
                      </ModalHeader>
                      <ModalBody>
                        <img src={selectedImageFile} alt="uploaded id" />
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="secondary"
                          onClick={() => setShowModal(false)}
                        >
                          Close
                        </Button>
                      </ModalFooter>
                    </Modal>
                    <FormGroup>
                      <Label for="idNumber">ID Number</Label>
                      <Input
                        type="text"
                        name="idNumber"
                        id="idNumber"
                        value={idNumber}
                        placeholder="ID Number"
                        onChange={handleIdNumberChange}
                        disabled={editing}
                      />
                      {error == 10 ? (
                        <span
                          className="font-recia"
                          style={{
                            color: "#f00",
                            fontSize: "14px",
                            marginTop: "6px",
                            display: "block",
                          }}
                        >
                          ID Number is required
                        </span>
                      ) : null}
                    </FormGroup>
                    <FormGroup>
                      <Label for="idExpirationDate">ID Expiration Date</Label>
                      <Input
                        type="date"
                        name="idExpirationDate"
                        id="idExpirationDate"
                        value={idExpirationDate}
                        onChange={handleIdExpirationDateChange}
                        disabled={editing}
                      />
                      {error == 11 ? (
                        <span
                          className="font-recia"
                          style={{
                            color: "#f00",
                            fontSize: "14px",
                            marginTop: "6px",
                            display: "block",
                          }}
                        >
                          ID Expiration Date is required
                        </span>
                      ) : null}
                    </FormGroup>
                    {editing ? (
                      <div>
                        <Button
                          className="btn-design"
                          color="info"
                          onClick={() => {
                            setLoading(true);
                            setEditing(false);
                            submitKYCDetails();
                          }}
                          disabled={loading}
                        >
                          Confirm Details
                        </Button>
                        <Button
                          className="edit-btn-design"
                          color="info"
                          onClick={() => setEditing(false)}
                          disabled={loading}
                        >
                          Edit Details
                        </Button>
                      </div>
                    ) : (
                      <Button
                        className="btn-design"
                        color="info"
                        onClick={() => handleSubmit()}
                        disabled={loading}
                      >
                        Submit KYC Details
                      </Button>
                    )}
                  </Form>
                </CardBody>
              </div>
            </div>
          </section>
        </Form>
      </Container>
    </>
  );
};
export default KycForm;
