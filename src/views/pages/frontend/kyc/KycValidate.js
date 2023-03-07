import React, { useState } from 'react'
import OTPInput, { ResendOTP } from "otp-input-react";

// reactstrap components
import { Button, Container, Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import KycUpload from './KycUpload';
import { useRouteMatch } from 'react-router-dom';
import { kycService } from "../../../../services/frontend/kyc.service";
import { notify, history, _canAccess } from '../../../../_helpers/index';

function KycValidate() {
  const [otp, setOTP] = useState("");
  const [isOtpValid, setIsOtpValid] = useState(false);

  const urlData = useRouteMatch({
    path: "/kyc/:mobile",
    strict: true,
    sensitive: true
  });
  // if(!urlData || !urlData.mobile){
  //   history.push('/');
  // }

  const renderButton = (buttonProps) => {
    const { layout, ...rest } = buttonProps
    return <><Button className="btn-round" color="info" {...rest}>{buttonProps.remainingTime !== 0 ? `Resend in ${buttonProps.remainingTime} sec...` : "Resend"}</Button></>
  };
  const renderTime = () => React.Fragment;

  function checkOtp() {
    kycService.validateOtp({
      'mobile_number': urlData.params.mobile,
      'otp': otp
    }).then(res => {
      console.log("res", res);
      if (res.status === false) {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        if (res.data.otp_key) {
          history.push(urlData.url + '/' + res.data.otp_key);
        }
      }
    });
  }

  function resendOtp() {
    kycService.resendOtp({
      'mobile_number': urlData.params.mobile,
    }).then(res => {
      if (res.status === false) {
        notify.error(res.message);
      } else {
        notify.success(res.message);
      }
    });
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
                          <CardTitle><b>Please enter OTP sent to registered phone number</b></CardTitle>
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
                                <ResendOTP renderButton={renderButton} renderTime={renderTime} onResendClick={() => resendOtp()} />
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
