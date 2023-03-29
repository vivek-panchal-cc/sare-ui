import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  Form,
} from "reactstrap";
import logo from "../img/logo.svg";
import kycComplete from "../img/complete.svg";
import axios from "axios";
import "../css/styles.css";

const KycSuccess = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [kycToken, setKycToken] = useState("");  
  const history = useHistory();
  const { mobile } = useParams();

  // useEffect(() => {
  //   setIsLoading(true);
  //   const kycToken = "kyc_0000000012";
  //   fetch(`${process.env.REACT_APP_KYC_API}kyc/checkStatus?token=${kycToken}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);
  //       // do something with the response data
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       setIsLoading(false);
  //     });
  // }, []);

  // useEffect(() => {
  //   const fetchApiData = async () => {
  //     try {
  //       const response = await axios.post(
  //         `${process.env.REACT_APP_KYC_API}kyc/checkStatus`,
  //         {
  //           kyc_token: mobile,
  //         }
  //       );
  //       setKycToken(response.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchApiData();
  // }, []);

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
