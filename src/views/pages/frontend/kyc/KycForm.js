/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from "react";
import {
  Container,
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
import "react-datepicker/dist/react-datepicker.css";
import { kycService } from "../../../../services/frontend/kyc.service";
import { useParams, useHistory } from "react-router-dom";
import { notify } from "../../../../_helpers/index";
import logo from "../img/logo.svg";
import uploadKYC from "../img/upload.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { businessEntitiesService } from "../../../../services/admin/business_entities.service";
import "../css/styles.css";

const KycForm = ({ props }) => {
  const [fullName, setFullName] = useState(props?.res?.name);
  const [email, setEmail] = useState(props?.res?.email);
  const [homeAddress, setHomeAddress] = useState({
    houseNumber: props?.res?.house_number,
    streetName: props?.res?.street_name,
    landmark: props?.res?.landmark,
    city: props?.res?.city,
    pincode: props?.res?.pincode,
  });
  const [businessEntity, setBusinessEntity] = useState(
    props?.res?.business_entity
  );
  const [businessEntities, setBusinessEntities] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [idNumber, setIdNumber] = useState(props?.res?.kyc_files[0]?.id_number);
  const [idExpirationDate, setIdExpirationDate] = useState(
    props?.res?.kyc_files[0]?.id_expiration_date
  );
  const [idFile, setIdFile] = useState(props?.res?.kyc_files[0]?.file);
  const [isImg, setIsImg] = useState(false);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData1, setFormData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const { mobile, secret_key } = useParams();
  const history = useHistory();
  const alreadyRedirected = useRef(false);

  let mobileNo = props?.res?.mobile_number;
  let businessType = props?.res?.kyc_type;
  let formData = new FormData();

  useEffect(() => {
    const unListen = history.listen((location, action) => {
      if (action === "POP" && !alreadyRedirected.current) {
        alreadyRedirected.current = true;
        // history.push("/kyc/404");
      }
    });

    return () => {
      unListen();
    };
  }, [history]);

  useEffect(() => {
    if (businessType === "business") {
      getBusinessEntities();
    }
  }, []);

  const getBusinessEntities = () => {
    businessEntitiesService.frontBusinessEntitiesList().then((res) => {
      if (res.success === false) {
        notify.error(res.message);
      } else {
        setBusinessEntities(res?.data);
      }
    });
  };

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
      setError(null);
    }
  };

  const handleHomeAddressChange = (e) => {
    setHomeAddress({
      ...homeAddress,
      [e.target.name]: e.target.value,
    });
  };

  const validatePhoneNumber = (phoneNumber) => {
    const regex = /^\d{9}$/;
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

  const handleBusinessEntityChange = (e) => {
    setBusinessEntity(e.target.value);
  };

  const handleDownloadPdf = (event) => {
    setLoading(true);
    event.preventDefault();
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
      setLoading(false);
    } else if (
      idFile &&
      (idFile.type === "image/jpeg" || idFile.type === "image/png")
    ) {
      const url = URL.createObjectURL(idFile);
      const a = document.createElement("a");
      a.href = url;
      a.download = "file.jpeg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setLoading(false);
    } else {
    }
  };

  const handleUploadedPdf = (url, event) => {
    setLoading(true);
    event.preventDefault();
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = url.substring(url.lastIndexOf("/") + 1);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setLoading(false);
    }
  };

  const handleIdFileChange = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      (file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg")
    ) {
      setIdFile(file);
      formData.append("file", file, "test.jpeg");
      setFormData(file);
    } else if (file && file.type === "application/pdf") {
      setIdFile(file);
      formData.append("file", file, "test.pdf");
      setFormData(file);
    } else {
    }
  };

  const clearImage = () => {
    setIdFile("");
  };

  const handlePreview = () => {
    if (idFile && !imgType) {
      setSelectedImageFile(URL.createObjectURL(idFile));
    } else if (imgType) {
      setSelectedImageFile(idFile);
    }
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (
      !fullName ||
      !email ||
      !homeAddress.houseNumber ||
      !homeAddress.streetName ||
      !homeAddress.landmark ||
      !homeAddress.city ||
      !homeAddress.pincode ||
      // !phoneNumber ||
      !idFile ||
      !idNumber ||
      !idExpirationDate
    ) {
      setError(0);
    } else if (!validateEmail(email)) {
      setError(2);
    } else if (
      businessType === "business" &&
      (!businessEntity || businessEntity === "")
    ) {
      setError(0);
    } else {
      setLoading(false);
      setEditing(true);
      const overlay = document.querySelector(".view-img");
      if (overlay?.style?.display) {
        overlay.style.display = "none"; // Hide the overlay
      }
    }
  };

  const handleEditDetails = () => {
    setEditing(false);
    const overlay = document.querySelector(".view-img");
    if (overlay?.style?.display) {
      overlay.style.display = "none"; // Show the overlay
    }
  };

  const submitKYCDetails = async () => {
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
    }
    //  else if (!phoneNumber) {
    //   setError(8);
    // }
    // else if (phoneNumber.length !== 9) {
    //   setError(8);
    // }
    else if (!idFile) {
      setError(9);
    } else if (!idNumber) {
      setError(10);
    } else if (!idExpirationDate) {
      setError(11);
    } else if (
      businessType === "business" &&
      (!businessEntity || businessEntity === "")
    ) {
      setError(12);
    } else {
      setLoading(true);
      setEditing(true);
      formData.append("kyc_token", mobile);
      formData.append("mobile_key", secret_key);
      formData.append("name", fullName);
      formData.append("email", email);
      formData.append("house_number", homeAddress.houseNumber);
      formData.append("street_name", homeAddress.streetName);
      formData.append("landmark", homeAddress.landmark);
      formData.append("city", homeAddress.city);
      formData.append("pincode", homeAddress.pincode);
      formData.append("phone_number", mobileNo);
      formData.append("id_number", idNumber);
      formData.append("id_expiration_date", idExpirationDate);
      if (businessType === "business") {
        formData.append("business_entity", businessEntity);
      }
      if (typeof idFile === "string") {
        formData.append("file", null);
      } else {
        formData.append("file", idFile);
      }
      try {
        setLoading(true);
        const res = await kycService.store(formData);
        if (res.success === false) {
          notify.error(res.message);
        } else if (res.success === true) {
          notify.success(res.message);
          history.push("/kyc/recieved");
        }
      } catch (error) {
        notify.error("An error occurred while submitting KYC information.");
      } finally {
        setLoading(false);
      }
    }
  };

  let imgType;
  if (typeof idFile === "string") {
    let img = idFile?.split(".");
    imgType = ["jpeg", "jpg", "png", "JPEG", "JPG", "PNG"].some((ext) =>
      img?.includes(ext)
    );
  }

  return (
    <>
      <Container>
        <section className="main-section kyc-form-page">
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
                    {error === 0 && !fullName ? (
                      <span
                        className="font-recia"
                        style={{
                          color: "#f00",
                          fontSize: "14px",
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
                    {error === 0 && !validateEmail(email) && (
                      <span
                        className="font-recia"
                        style={{
                          color: "#f00",
                          fontSize: "14px",
                          display: "block",
                        }}
                      >
                        Email field is required
                      </span>
                    )}
                    {error === 2 &&
                      error !== null &&
                      email !== "" &&
                      !validateEmail(email) && (
                        <span
                          className="font-recia"
                          style={{
                            color: "#f00",
                            fontSize: "14px",
                            display: "block",
                          }}
                        >
                          Email is not in the correct format
                          <br />
                          (eg. abc@abc.com)
                        </span>
                      )}
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
                    {error === 0 && !homeAddress.houseNumber ? (
                      <span
                        className="font-recia"
                        style={{
                          color: "#f00",
                          fontSize: "14px",
                          display: "block",
                          margin: "-10px 0 8px 0",
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
                    {error === 0 && !homeAddress.streetName ? (
                      <span
                        className="font-recia"
                        style={{
                          color: "#f00",
                          fontSize: "14px",
                          display: "block",
                          margin: "-10px 0 8px 0",
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
                    {error === 0 && !homeAddress.landmark ? (
                      <span
                        className="font-recia"
                        style={{
                          color: "#f00",
                          fontSize: "14px",
                          display: "block",
                          margin: "-10px 0 8px 0",
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
                    {error === 0 && !homeAddress.city ? (
                      <span
                        className="font-recia"
                        style={{
                          color: "#f00",
                          fontSize: "14px",
                          display: "block",
                          margin: "-10px 0 8px 0",
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
                      min={1}
                    />
                    {error === 0 && !homeAddress.pincode ? (
                      <span
                        className="font-recia"
                        style={{
                          color: "#f00",
                          fontSize: "14px",
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
                      value={mobileNo}
                      onChange={handlePhoneNumberChange}
                      placeholder="Phone Number"
                      disabled={true}
                    />
                    {/* {phoneNumberError && (
                        <span
                          className="font-recia"
                          style={{
                            color: "#f00",
                            fontSize: "14px",
                            display: "block",
                            margin: "0 0 8px -10px"
                          }}
                        >
                          {phoneNumberError}
                        </span>
                      )}
                      {error === 0 && !phoneNumber && !phoneNumberError ? (
                        <span
                          className="font-recia"
                          style={{
                            color: "#f00",
                            fontSize: "14px",                            
                            display: "block",
                            margin: "0 0 8px -10px"
                          }}
                        >
                          Phone number is required
                        </span>
                      ) : null} */}
                  </FormGroup>
                  <FormGroup>
                    <Label for="idFile">Copy of ID</Label>
                    <div className="file-upload-design position-relative">
                      <div className="upload-part">
                        {!idFile ? (
                          <>
                            <div style={{ marginRight: "10px" }}>
                              <img
                                src={uploadKYC}
                                alt="upload"
                                className="upload-svg"
                              />
                            </div>
                            <strong>Upload</strong>
                            <Input
                              type="file"
                              name="idFile"
                              id="idFile"
                              accept="image/*, application/pdf"
                              onChange={handleIdFileChange}
                              disabled={editing}
                            />
                          </>
                        ) : idFile instanceof File ? (
                          <>
                            {idFile.type.includes("image/") ? (
                              <>
                                <div
                                  className="image-upload-div position-relative"
                                  style={{ width: "100%" }}
                                >
                                  <img
                                    src={URL.createObjectURL(idFile)}
                                    alt="uploaded id"
                                    style={{
                                      cursor: "pointer",
                                      maxHeight: "270px",
                                      objectPosition: "center",
                                      objectFit: "cover",
                                      height: "270px",
                                      width: "100%",
                                    }}
                                  />
                                  <span>
                                    <a
                                      className="view-img"
                                      onClick={
                                        !editing ? clearImage : handlePreview
                                      }
                                      disabled={!editing}
                                      style={{ textAlign: "center" }}
                                    >
                                      {!editing ? (
                                        "Remove Image"
                                      ) : (
                                        <div>
                                          <FontAwesomeIcon icon={faEye} />{" "}
                                          <span>View</span>
                                        </div>
                                      )}
                                    </a>
                                  </span>
                                </div>
                              </>
                            ) : idFile.type === "application/pdf" ? (
                              <>
                                <span>
                                  <a
                                    className="view-pdf"
                                    href="#"
                                    onClick={(event) =>
                                      handleDownloadPdf(event)
                                    }
                                    disabled={editing}
                                  >
                                    <strong>
                                      {!editing ? "Download PDF" : ""}
                                    </strong>
                                  </a>
                                </span>
                                <span>
                                  <strong>
                                    {editing ? "PDF Uploaded" : ""}
                                  </strong>
                                </span>
                                <span>
                                  <a
                                    className="view-tag"
                                    onClick={clearImage}
                                    disabled={editing}
                                    style={{
                                      marginBottom: "100px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    {!editing ? "Remove PDF" : ""}
                                  </a>
                                </span>
                              </>
                            ) : null}
                          </>
                        ) : imgType ? (
                          <>
                            <div
                              className="image-upload-div position-relative"
                              style={{ width: "100%" }}
                            >
                              <img
                                src={idFile}
                                alt="uploaded id"
                                style={{
                                  cursor: "pointer",
                                  maxHeight: "270px",
                                  objectPosition: "center",
                                  objectFit: "cover",
                                  height: "270px",
                                  width: "100%",
                                }}
                              />
                              <span>
                                <a
                                  className="view-img"
                                  onClick={
                                    !editing ? clearImage : handlePreview
                                  }
                                  disabled={!editing}
                                  style={{ textAlign: "center" }}
                                >
                                  {!editing ? (
                                    "Remove Image"
                                  ) : (
                                    <div>
                                      <FontAwesomeIcon icon={faEye} />{" "}
                                      <span>View</span>
                                    </div>
                                  )}
                                </a>
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <span>
                              <a
                                className="view-pdf"
                                href={idFile}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(event) =>
                                  handleUploadedPdf(idFile, event)
                                }
                                disabled={editing}
                              >
                                <strong>
                                  {!editing ? "Download PDF" : ""}
                                </strong>
                              </a>
                            </span>
                            <span>
                              <strong>{editing ? "PDF Uploaded" : ""}</strong>
                            </span>
                            <span>
                              <a
                                className="view-tag"
                                onClick={clearImage}
                                disabled={editing}
                                style={{
                                  marginBottom: "100px",
                                  cursor: "pointer",
                                }}
                              >
                                {!editing ? "Remove PDF" : ""}
                              </a>
                            </span>
                          </>
                        )}
                        {error === 0 && !idFile ? (
                          <div className="error-message">
                            <span
                              className="font-recia"
                              style={{
                                color: "#f00",
                                fontSize: "14px",
                              }}
                            >
                              File is required
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </FormGroup>
                  <Modal isOpen={showModal} toggle={() => setShowModal(false)}>
                    <ModalHeader toggle={() => setShowModal(false)}>
                      Image Preview
                    </ModalHeader>
                    <ModalBody>
                      <img
                        src={selectedImageFile}
                        alt="uploaded id"
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
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
                  {businessType === "business" && (
                    <FormGroup>
                      <Label for="businessEntity">Business Entity</Label>
                      <Input
                        type="select"
                        name="businessEntity"
                        id="businessEntity"
                        value={businessEntity}
                        placeholder="Business Entity"
                        onChange={handleBusinessEntityChange}
                        disabled={editing}
                        hidden={businessType !== "business"}
                        style={{
                          cursor: "pointer",
                          fontFamily: "Plus Jakarta Sans Medium",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        <option
                          style={{
                            cursor: "pointer",
                            fontFamily: "Plus Jakarta Sans Medium",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                          value=""
                          hidden={businessType !== "business"}
                        >
                          Select Business Entity
                        </option>
                        {businessEntities?.map((entity) => (
                          <option
                            key={entity.id}
                            value={entity.id}
                            style={{
                              cursor: "pointer",
                              fontFamily: "Plus Jakarta Sans Medium",
                              fontSize: "14px",
                              fontWeight: "500",
                            }}
                            hidden={businessType !== "business"}
                          >
                            {entity.entity}
                          </option>
                        ))}
                      </Input>
                      {error === 0 &&
                      !businessEntity &&
                      businessType === "business" ? (
                        <span
                          className="font-recia"
                          style={{
                            color: "#f00",
                            fontSize: "14px",
                            display: "block",
                          }}
                        >
                          Business Entity is required
                        </span>
                      ) : null}
                    </FormGroup>
                  )}
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
                    {error === 0 && !idNumber ? (
                      <span
                        className="font-recia"
                        style={{
                          color: "#f00",
                          fontSize: "14px",
                          display: "block",
                        }}
                      >
                        ID Number is required
                      </span>
                    ) : null}
                  </FormGroup>
                  <FormGroup className="form-group col-xs-12">
                    <Label for="idExpirationDate">ID Expiration Date</Label>
                    <Input
                      type="date"
                      name="idExpirationDate"
                      id="idExpirationDate"
                      value={idExpirationDate}
                      onChange={handleIdExpirationDateChange}
                      style={{ cursor: "pointer" }}
                      disabled={editing}
                      min={new Date().toISOString().split("T")[0]}
                      onClick={(e) => {
                        e.target.focus();
                      }}
                    />
                    {error === 0 && !idExpirationDate ? (
                      <span
                        className="font-recia"
                        style={{
                          color: "#f00",
                          fontSize: "14px",
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
                        // style={{ marginBottom: "-20px" }}
                        className="edit-btn-design"
                        color="info"
                        onClick={() => handleEditDetails()}
                        disabled={loading}
                      >
                        Edit Details
                      </Button>
                    </div>
                  ) : (
                    <Button
                      // style={{ marginBottom: "-20px" }}
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
      </Container>
    </>
  );
};
export default KycForm;
