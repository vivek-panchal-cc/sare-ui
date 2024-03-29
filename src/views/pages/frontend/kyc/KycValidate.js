import { useState, useEffect } from "react";
import OTPInput from "otp-input-react";
import successImage from "../img/check_circle.png";
import logo from "../img/logo.svg";
import "../css/styles.css";

import {
  Button,
  Container,
  Row,
  CardBody,
  CardTitle,
  Form,
  CardHeader,
} from "reactstrap";
import KycChecking from "./KycChecking";
import { useRouteMatch, useParams } from "react-router-dom";
import { kycService } from "../../../../services/frontend/kyc.service";
import { notify, history } from "../../../../_helpers/index";

function KycValidate() {
  const [otp, setOTP] = useState("");
  const [isOtpValid, setIsOtpValid] = useState(false);
  const [otpAttempted, setOtpAttempted] = useState(false);
  const [countdown, setCountdown] = useState(60); // in seconds  
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const { mobile } = useParams();

  const urlData = useRouteMatch({
    path: "/kyc/:mobile",
    strict: true,
    sensitive: true,
  });

  useEffect(() => {
    let intervalId = null;
    if (countdown !== null && countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
      setIsResendDisabled(true);
    } else if (countdown === 0) {
      setIsResendDisabled(false);
      clearInterval(intervalId);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearInterval(intervalId);
  }, [countdown]);

  // There are some bugs in state therefor changes state value and showing message in html according to OTP value (Changes made by Vivek Panchal)
  function checkOtp(event) {
    event.preventDefault();
    const postData = {
      kyc_token: mobile,
      otp: otp,
    };

    kycService.validateOtp(postData).then((res) => {
      if (res.success === false) {
        notify.error(res.message);
        setIsOtpValid(false);
        setOtpAttempted(true);
        setTimeout(() => {
          setOTP("");
        }, 0); // wait for 0 seconds before showing the error message
      } else {
        notify.success(res.message);
        setIsOtpValid(true);
        setOtpAttempted(true);
        if (res.data.otp_key) {
          setTimeout(() => {
            history.push(`${urlData.url}/${res.data.otp_key}`);
          }, 0); // wait for 0 seconds before redirecting
        }
      }
    });
    window.history.pushState(null, null, window.location.href);
    window.history.replaceState({}, document.title, window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, null, window.location.href);
    };
  }

  function handleClear() {
    setOTP("");
  }

  //  While hitting on resendOTP it will throw an error so resolved it in API Call (Changes made by Vivek Panchal)
  function resendOtp() {
    const postData = { kyc_token: mobile };
    setCountdown(60);
    setIsResendDisabled(true);
    kycService
      .resendOtp(postData)
      .then((res) => {
        if (res.success === false) {
          notify.error(res.message);
        } else {
          notify.success(res.message);
        }
      })
      .catch(() => {
        notify.error("Something went wrong");
      });
  }

  return (
    <>
      <Container>
        {isOtpValid && !otpAttempted ?
          <KycChecking />
         : (
          <Form onSubmit={checkOtp} onReset={handleClear}>
            <section className="main-section enter-otp-page">
              <div className="container">
                <div className="logo-part text-center">
                  <img src={logo} alt="logo" className="mes-img" />
                </div>
                <div className="box text-center">
                  <CardHeader>
                    <CardTitle className="sub-heading text-center text-color">
                      <b>Please enter OTP sent to registered phone number</b>
                    </CardTitle>
                  </CardHeader>
                    <CardBody>
                      <br />
                      <div className="otp-input">
                          <OTPInput
                            value={otp}
                            onChange={setOTP}
                            autoFocus
                            OTPLength={4}
                            otpType="number"
                            disabled={false}
                          />
                      </div>
                      <br />
                      <Row className="message-form">
                        {otp.length !== 4 ? (
                          <>
                            <p className="otp-mes">
                              {/* <img
                                src={errorImage}
                                alt="check_circle"
                                className="mes-img"
                              /> */}
                              {/* Please enter an OTP */}
                            </p>
                          </>
                        ) : (
                          <>
                            {isOtpValid ? (
                              <p className="sucess-mes sucess-color">
                                <img
                                  src={successImage}
                                  alt="check_circle"
                                  className="mes-img"
                                />
                                Success
                              </p>
                            ) : (
                              otpAttempted &&
                              !isOtpValid && (
                                <p className="error-mes red-color">
                                  {/* <img
                                    src={errorImage}
                                    alt="check_circle"
                                    className="mes-img"
                                  />
                                  Incorrect OTP. Please try again. */}
                                </p>
                              )
                            )}
                          </>
                        )}
                      </Row>
                      <div className="otp-time">
                        {countdown !== null
                          ? `${Math.floor(countdown / 60)
                              .toString()
                              .padStart(2, "0")}:${(countdown % 60)
                              .toString()
                              .padStart(2, "0")}`
                          : "00:00"}
                      </div>
                      <Button
                        type="button"
                        className="resend-btn"
                        hidden={isResendDisabled}
                        onClick={() => resendOtp()}
                      >
                        Resend Code
                      </Button>

                      <div>
                        {otp.length === 4 && (
                          // <Col>
                          <Button
                          style={{marginTop: "20px"}}
                            className="btn-design"
                            color="info"
                            type="submit"
                            disabled={isOtpValid}
                            // onClick={(event) => checkOtp(event)}
                          >
                            {isOtpValid ? "Loading..." : "Submit"}
                          </Button>
                          // </Col>
                        )}
                        {/* <Col> */}
                        <Button                          
                          className="edit-btn-design"
                          color="info"
                          type="reset"
                          // onClick={handleCancel}
                          disabled={isOtpValid}
                        >
                          Clear
                        </Button>
                        {/* </Col> */}
                      </div>
                    </CardBody>
                </div>
              </div>
            </section>
          </Form>
        )}
      </Container>
    </>
  );
}
export default KycValidate;
