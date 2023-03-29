import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
} from "reactstrap";
import logo from "../img/logo.svg";
import review from "../img/reviewe.svg";
import errorImage from "../img/error.png";
import errorBlack from "../img/error-black.svg";
import "../css/styles.css";
import { setLoading } from "_helpers";
import KycForm from "./KycForm";

function KycFailure() {
  const history = useHistory();
  const { mobile, secret_key } = useParams();
  const [kycFormLoading, setKycFormLoading] = useState(false);

  const handleButtonClick = () => {
    setLoading(true);
    const mobileNo = mobile;
    const key = secret_key;
    setKycFormLoading(true);
    // history.push(`/kyc/${mobileNo}/${key}`);
    setLoading(false);
  };

  return (
    <>
      <Container>
        {!kycFormLoading ? (
          <form>
            <section className="main-section">
              <div className="container">
                <div className="logo-part text-center">
                  <img src={logo} alt="logo" className="mes-img"></img>
                </div>
                <div className="box text-center">
                  <CardBody>
                    <CardTitle className="sub-heading">
                      <b>KYC Verification Error</b>
                    </CardTitle>
                    <Row>
                      <p className="light-blue margin-failure">
                        Please upload all the following documents and fulfill
                        details provided in comments
                      </p>
                    </Row>
                    <div className="error-mes-box overlay-1">
                      <div className="heading-error text-red">
                        <img
                          src={errorImage}
                          alt="error"
                          className="error-img"
                          style={{ marginRight: "10px", marginTop: "-3px" }}
                        />
                        <p className="heading-error text-red">
                          Required Documents List
                        </p>
                      </div>
                      <br />
                      <ul className="error-list">
                        <li>Address Proof</li>
                        <li>ID Proof</li>
                        <li>Lorem Ipsum</li>
                      </ul>
                    </div>

                    <div className="error-mes-box overlay-2">
                      <div className="heading-error text-black">
                        <img
                          src={errorBlack}
                          alt="error"
                          className="error-img"
                          style={{ marginRight: "10px", marginTop: "-3px" }}
                        />
                        <p className="heading-error text-black">
                          Comments from SARE
                        </p>
                      </div>
                      <br />
                      <p className="heading-error-mes">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry.
                      </p>
                    </div>
                    {/* <Row className="kyc-received-img">
                    <img src={review} alt="review" className="reviewe-img" />
                  </Row> */}
                    <Button
                      className="btn-design"
                      color="info"
                      onClick={handleButtonClick}
                    >
                      Complete KYC Details
                    </Button>
                  </CardBody>
                </div>
              </div>
            </section>
          </form>
        ) : (
          <>
            <KycForm />
          </>
        )}
      </Container>
    </>
  );
}

export default KycFailure;
