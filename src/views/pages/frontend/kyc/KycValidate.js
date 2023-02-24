import React, { useState } from 'react'
import OTPInput, { ResendOTP } from "otp-input-react";

// reactstrap components
import { Button, Container, Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import KycUpload from './KycUpload';
import { history } from '_helpers';
import { useRouteMatch } from 'react-router-dom';

function KycValidate() {
  const [otp, setOTP] = useState("");
  const [isOtpValid, setIsOtpValid] = useState(false);

  const urlData = useRouteMatch({
    path: "/kyc/:mobile",
    strict: true,
    sensitive: true
  });
  console.log("urlData", urlData);
  // if(!urlData || !urlData.mobile){
  //   history.push('/');
  // }

  const renderButton = (buttonProps) => {
    const { layout, ...rest } = buttonProps
    return <><Button className="btn-round" color="info" {...rest}>{buttonProps.remainingTime !== 0 ? `Resend in ${buttonProps.remainingTime} sec...` : "Resend"}</Button></>
  };
  const renderTime = () => React.Fragment;

  function checkOtp() {
    console.log("urlData.url", urlData.url);

    // get hash key for further process
    const secretKey = "6759E2A6556D897293CBE672C76F3B369A6775F24141CA7D42C400A8DCC8E647";
    history.push(urlData.url + '/' + secretKey);

    // if (otp === '9999') {
    //   setIsOtpValid(true);
    // } else {
    //   setIsOtpValid(false);
    // }
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
                  <>
                    <div className="text-center">
                      <Card className='col-md-6 offset-md-3'>
                        {/* <CardHeader>Featured</CardHeader> */}
                        <CardBody>
                          <CardTitle>Please enter OTP sent to registered phone number</CardTitle>
                          <CardBody>
                            <br />
                            <Row className='text-center'>
                              <Col md="6" className='offset-md-3'>
                                <OTPInput value={otp} onChange={setOTP} autoFocus OTPLength={4} otpType="number" disabled={false} />
                              </Col>
                            </Row>
                            <br />
                            <Row className='text-center'>
                              <Col md="5" className='offset-md-2'>
                                <ResendOTP renderButton={renderButton} renderTime={renderTime} />
                              </Col>
                              {
                                (() => {
                                  if (otp.length === 4) {
                                    return (
                                      <Col md="3">
                                        <Button className="btn-round" color="info" onClick={() => checkOtp()}>Submit</Button>
                                      </Col>
                                    )
                                  }
                                })()
                              }
                            </Row>
                          </CardBody>
                        </CardBody>
                      </Card>
                    </div>
                  </>
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
