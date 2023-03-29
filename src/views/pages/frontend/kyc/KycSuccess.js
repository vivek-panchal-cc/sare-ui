import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Container, Row, CardBody, Button, Form } from "reactstrap";
import logo from "../img/logo.svg";
import kycComplete from "../img/complete.svg";
import "../css/styles.css";

const KycSuccess = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [kycToken, setKycToken] = useState("");
  const history = useHistory();
  const { mobile } = useParams();

  const handleButtonClick = () => {
    setIsLoading(true);
    if (kycToken.success && kycToken.data.proceed_to_otp === true) {
      history.push("/kyc/kycValidate");
    } else {
      console.error("Unable to proceed to OTP. Try after sometime");
    }
  };

  return (
    <>
      <Container>
        <section className="main-section">
          <div className="container">
            <div className="logo-part text-center">
              <img src={logo} alt="logo" className="mes-img"></img>
            </div>
            <Form className="box text-center">
              <CardBody>
                <div className="complete-part">
                  <img
                    src={kycComplete}
                    alt="kycComplete"
                    className="complete-img"
                  />
                </div>
                <Row>
                  <p
                    className="complete-heading"
                    style={{ marginBottom: "-10px" }}
                  >
                    Your KYC process is complete, Please continue with the SARE
                    app/USSD service.
                  </p>
                </Row>
                <Button
                  className="btn-design"
                  color="info"
                  onClick={handleButtonClick}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Open"}
                </Button>
              </CardBody>
            </Form>
          </div>
        </section>
      </Container>
    </>
  );
};
export default KycSuccess;
