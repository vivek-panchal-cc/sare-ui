import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, CardBody, CardTitle, Container, Row } from "reactstrap";
import { setLoading } from "_helpers";
import "../css/styles.css";
import errorBlack from "../img/error-black.svg";
import errorImage from "../img/error.png";
import logo from "../img/logo.svg";
import KycForm from "./KycForm";

function KycFailure({ props }) {
  const { mobile, secret_key } = useParams();
  const [kycFormLoading, setKycFormLoading] = useState(true);
  let res = props.kycReasons;
  let comments = props.kycReasons.kyc_reasons;
  console.log("Res", res);
  console.log("Comments", comments);

  const handleButtonClick = () => {
    setLoading(true);
    setKycFormLoading(false);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  //  Design Changed in Below HTML (Changes made by Vivek Panchal)
  return (
    <>
      <Container>
        {kycFormLoading ? (
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
                      <ul
                        className="heading-error-mes"                        
                      >
                        {comments
                          .filter((reason) => reason.comment_type === "admin")
                          .map((reason) => (
                            <li key={reason.id}>{reason.comment}</li>
                          ))}
                      </ul>
                    </div>
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
            <KycForm props={{ res }} />
          </>
        )}
      </Container>
    </>
  );
}

export default KycFailure;
