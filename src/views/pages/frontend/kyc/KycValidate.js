import React, { useState, useEffect } from "react";
import OTPInput, { ResendOTP } from "otp-input-react";
import successImage from "../img/check_circle.png";
import errorImage from "../img/error.png";
import logo from "../img/logo.svg";
import "../css/styles.css";

// reactstrap components
import {
  Button,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Form,
} from "reactstrap";
import KycChecking from "./KycChecking";
import { useRouteMatch, useParams } from "react-router-dom";
import { kycService } from "../../../../services/frontend/kyc.service";
import { notify, history, _canAccess } from "../../../../_helpers/index";

function KycValidate() {
  const [otp, setOTP] = useState("");
  const [isOtpValid, setIsOtpValid] = useState(false);
  const [otpAttempted, setOtpAttempted] = useState(false);
  const [countdown, setCountdown] = useState(120); // in seconds
  const [resendDisabled, setResendDisabled] = useState(false);
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

  function checkOtp() {
    const postData = {
      kyc_token: mobile,
      otp: otp,
    };

    kycService.validateOtp(postData).then((res) => {
      console.log("res", res);
      if (res.status === false) {
        notify.error(res.message);
        setIsOtpValid(true);
        setOtpAttempted(true);
      } else {
        notify.success(res.message);
        setIsOtpValid(false);
        setOtpAttempted(true);
        if (res.data.otp_key) {
          history.push(urlData.url + "/" + res.data.otp_key);
        }
      }
    });
  }

  function resendOtp() {
    const postData = { kyc_token: mobile };
    setCountdown(120); // set countdown to 120 seconds
    setIsResendDisabled(true); // disable the resend button
    kycService
      .resendOtp(postData)
      .then((res) => {
        if (res.status === false) {
          notify.error(res.message);
        } else {
          notify.success(res.message);
        }
      })
      .catch((error) => {
        notify.error("Something went wrong");
      });
  }

  const countdownToString = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <>
      <Container>
        {isOtpValid ? (
          <KycChecking />
        ) : (
          <Form>
            <section className="main-section enter-otp-page">
              <div className="container">
                <div className="logo-part text-center">
                  <img src={logo} alt="logo" className="mes-img" />
                </div>
                <div className="box text-center">
                  <CardBody>
                    <CardTitle className="sub-heading text-center text-color">
                      <b>Please enter OTP sent to registered phone number</b>
                    </CardTitle>
                    <CardBody>
                      <br />
                      <Row className="otp-input">
                        <Col md="6" className="common-size">
                          <OTPInput
                            value={otp}
                            onChange={setOTP}
                            autoFocus
                            OTPLength={4}
                            otpType="number"
                            disabled={false}
                          />
                        </Col>
                      </Row>
                      <br />
                      <Row className="message-form">
                        {otp.length !== 4 ? (
                          <>
                            <p className="error-mes red-color">
                              <img
                                src={errorImage}
                                alt="check_circle"
                                className="mes-img"
                              />
                              Please enter a valid OTP
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
                                Success Message
                              </p>
                            ) : (
                              otpAttempted && (
                                <p className="error-mes red-color">
                                  <img
                                    src={errorImage}
                                    alt="check_circle"
                                    className="mes-img"
                                  />
                                  Incorrect OTP. Please try again.
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
                        disabled={isResendDisabled}
                        onClick={() => resendOtp()}
                      >
                        Resend Code
                      </Button>

                      <Row className="text-center">
                        {otp.length === 4 && !otpAttempted && (
                          <Col>
                            <Button
                              className="btn-design"
                              color="info"
                              onClick={() => checkOtp()}
                            >
                              Submit
                            </Button>
                          </Col>
                        )}
                        <Col>
                          <Button className="btn-design" color="info">
                            Cancel
                          </Button>
                        </Col>
                      </Row>
                    </CardBody>
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
