import React, { useState } from 'react'
import OTPInput, { ResendOTP } from "otp-input-react";

// reactstrap components
import { Button, Container, Row, Col } from "reactstrap";
import KycUpload from './KycUpload';

function KycValidate() {
  const [otp, setOTP] = useState("");
  const [isOtpValid, setIsOtpValid] = useState(false);

  const renderButton = (buttonProps) => {
    const { layout, ...rest } = buttonProps
    return <Button className="btn-round" color="info" {...rest}>
      {buttonProps.remainingTime !== 0 ? `Please wait for ${buttonProps.remainingTime} sec` : "Resend"}
    </Button>
  };
  const renderTime = () => React.Fragment;

  function checkOtp() {
    if (otp === '9999') {
      setIsOtpValid(true);
    } else {
      setIsOtpValid(false);
    }
    console.log("isOtpValid", isOtpValid);

  }

  return (
    <>
      <div className="section text-center">
        <Container>
          {
            (() => {
              if (isOtpValid) {
                return (
                  <KycUpload />
                )
              } else {
                return (
                  <Row>
                    <Col className="ml-auto mr-auto" md="8">
                      <h2 className="title">Please enter OTP sent to registered phone number:</h2>
                      <OTPInput value={otp} onChange={setOTP} autoFocus OTPLength={4} otpType="number" disabled={false} secure />
                      <ResendOTP onResendClick={() => console.log("Resend clicked")} />
                      {/* <ResendOTP renderButton={renderButton} renderTime={renderTime} /> */}
                    </Col>
                    {
                      (() => {
                        if (otp.length === 4) {
                          return (
                            <Col className="ml-auto mr-auto" md="8">
                              <Button className="btn-round" color="info" onClick={() => checkOtp()}>Submit</Button>
                            </Col>
                          )
                        }
                      })()
                    }
                  </Row>
                )
              }
            })()
          }
        </Container>
      </div>
    </>
  )
}
export default KycValidate;
