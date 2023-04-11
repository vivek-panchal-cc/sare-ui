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
} from "reactstrap";
import logo from "../img/logo.svg";
import kycComplete from "../img/complete.svg";
import uploadKYC from "../img/upload.svg";
import view from "../img/view.svg";
import "../css/styles.css";

const KycConfirmationForm = () => {
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
  const [idNumber, setIdNumber] = useState("");
  const [idExpirationDate, setIdExpirationDate] = useState("");
  const [idFile, setIdFile] = useState(null);
  const [idImage, setIdImage] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleIdImageChange = (e) => {
    const image = e.target.files[0];
    setIdImage(image);
  };

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleHomeAddressChange = (e) => {
    setHomeAddress({
      ...homeAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleIdNumberChange = (e) => {
    setIdNumber(e.target.value);
  };

  const handleIdExpirationDateChange = (e) => {
    setIdExpirationDate(e.target.value);
  };

  const handleIdFileChange = (event) => {
    setIdFile(event.target.files[0]);
  };

  return (
    <>
      <Container>
        <section className="main-section">
          <div className="container">
            <div className="logo-part text-center">
              <img src={logo} alt="logo" className="mes-img"></img>
            </div>
            <div className="box text-center">
              <CardBody>
                <CardTitle className="kyc-form-sub-heading">
                  <b>Please Confirm KYC Details</b>
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
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Email"
                    />
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
                    />
                    <Input
                      style={{ marginBottom: "10px" }}
                      type="text"
                      name="streetName"
                      value={homeAddress.streetName}
                      onChange={handleHomeAddressChange}
                      placeholder="Street Name"
                    />
                    <Input
                      style={{ marginBottom: "10px" }}
                      type="text"
                      name="landmark"
                      value={homeAddress.landmark}
                      onChange={handleHomeAddressChange}
                      placeholder="Landmark"
                    />
                    <Input
                      style={{ marginBottom: "10px" }}
                      type="text"
                      name="city"
                      value={homeAddress.city}
                      onChange={handleHomeAddressChange}
                      placeholder="City"
                    />
                    <Input
                      type="number"
                      name="pincode"
                      value={homeAddress.pincode}
                      onChange={handleHomeAddressChange}
                      placeholder="Pincode"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Phone Number</Label>
                    <Input
                      type="text"
                      name="phone_number"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      placeholder="Phone Number"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="idCopy">Copy of ID</Label>
                    <div className="file-upload-design position-relative">
                      {/* Show upload input if no image selected */}
                      {!idImage && (
                        <div className="upload-part">
                          <div className="upload-text">
                            <img
                              src={uploadKYC}
                              alt="upload"
                              className="upload-svg"
                            />
                            Upload
                          </div>
                          <Input
                            type="file"
                            name="idCopy"
                            id="idCopy"
                            className="input-design"
                            accept="image/jpeg"
                            onChange={handleIdImageChange}
                          />
                        </div>
                      )}
                      {/* Show image preview if image selected */}
                      {idImage && (
                        <div
                          className="image-content"
                          style={{ display: "block" }}
                        >
                          <div className="image-upload-div position-relative">
                            <p
                              onClick={() => setModalIsOpen(true)}
                              className="view-id"
                            >
                              <img src={view} alt="view" />
                            </p>
                            <img
                              src={URL.createObjectURL(idImage)}
                              alt="document"
                              className="upload-img"
                            />
                          </div>
                          <Modal
                            isOpen={modalIsOpen}
                            onRequestClose={() => setModalIsOpen(false)}
                            contentLabel="View ID Modal"
                            onClick={() => setModalIsOpen(false)}
                          >
                            <img
                              src={URL.createObjectURL(idImage)}
                              alt="document"
                              className="modal-image"
                            />
                          </Modal>
                        </div>
                      )}
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <Label for="idNumber">ID Number</Label>
                    <Input
                      type="text"
                      name="idNumber"
                      id="idNumber"
                      value={idNumber}
                      placeholder="ID Number"
                      onChange={handleIdNumberChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="idExpirationDate">ID Expiration Date</Label>
                    <Input
                      type="date"
                      name="idExpirationDate"
                      id="idExpirationDate"
                      value={idExpirationDate}
                      onChange={handleIdExpirationDateChange}
                    />
                  </FormGroup>

                  <Button className="btn-design" color="info">
                    Confirm and Submit
                  </Button>
                  <Button className="edit-btn-design" color="info">
                    Edit Details
                  </Button>
                </Form>
              </CardBody>
            </div>
          </div>
        </section>
      </Container>
    </>
  );
};
export default KycConfirmationForm;
