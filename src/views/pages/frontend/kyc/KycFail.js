import { useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, CardBody, Form } from "reactstrap";
import logo from "../img/logo.svg";
import kycfail from "../img/kycfail.svg";
import "../css/styles.css";

const KycFail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [kycToken, setKycToken] = useState("");
  const { mobile } = useParams();

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
                  <img src={kycfail} alt="kycfail" className="complete-img" />
                </div>
                <Row className="complete-heading">
                  <p style={{ color: "red", fontWeight: "600" }}>
                    Invalid Access
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
export default KycFail;
