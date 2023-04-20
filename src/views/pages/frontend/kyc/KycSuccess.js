import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Container, Row, CardBody, Form } from "reactstrap";
import logo from "../img/logo.svg";
import kycComplete from "../img/complete.svg";
import "../css/styles.css";

const KycSuccess = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [kycToken, setKycToken] = useState("");
  const history = useHistory();

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
                <Row className="complete-heading text-color">
                  <p>
                    Your KYC process is yet to be approved.<br/>
                    Please check later.
                  </p>
                </Row>
                {/* <Button
                  className="btn-design"
                  color="info"
                  onClick={handleButtonClick}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Open"}
                </Button> */}
              </CardBody>
            </Form>
          </div>
        </section>
      </Container>
    </>
  );
};
export default KycSuccess;
