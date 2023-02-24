import React, { useState } from 'react'
import { useRouteMatch } from 'react-router-dom';

// reactstrap components
import { Button, Form, FormGroup, Label, Input, Card, CardBody, CardTitle } from "reactstrap";
import { history } from '_helpers';

function KycUpload() {
  const [comment, setComment] = useState('');
  const [firstFile, setFirstFile] = useState();
  const [secondFile, setSecondFile] = useState();
  const [thirdFile, setThirdFile] = useState();

  const urlData = useRouteMatch({
    path: "/kyc/:mobile/:secretId",
    strict: true,
    sensitive: true
  });
  // if(!urlData || !urlData.mobile || !urlData.secretId){
  //   history.push('/');
  // }

  function handleFirstFileChange(event) {
    setFirstFile(event.target.files[0])
  }
  function handleSecondFileChange(event) {
    setSecondFile(event.target.files[0])
  }
  function handleThirdFileChange(event) {
    setThirdFile(event.target.files[0])
  }

  function submitKyc() {
    console.log("urlData", urlData);
    console.log("submitKyc");
    console.log("comment", comment);
    console.log("firstFile", firstFile);
    console.log("secondFile", secondFile);
    console.log("thirdFile", thirdFile);

  }

  return (
    <>
      {/* <div className="text-center"> */}
      <Card className='col-md-6 offset-md-3 text-center'>
        <CardBody>
          <CardTitle>Upload Kyc Documents</CardTitle>
          <CardBody>
            <br />
            <Form>
              <FormGroup>
                <Label for="comment">Comment:</Label>
                <Input id="comment" value={comment} onChange={(e) => { setComment(e.target.value) }} name="text" type="textarea" />
              </FormGroup>
              <FormGroup>
                <Label for="firstFile">Files:</Label>
                <Input id="firstFile" name="file" type="file" onChange={handleFirstFileChange} />
              </FormGroup>
              <FormGroup>
                <Input id="secondFile" name="file" type="file" onChange={handleSecondFileChange} />
              </FormGroup>
              <FormGroup>
                <Input id="thirdFile" name="file" type="file" onChange={handleThirdFileChange} />
              </FormGroup>
              <Button className="btn-round" color="info" onClick={() => submitKyc()}>Submit</Button>
            </Form>
            <br />
          </CardBody>
        </CardBody>
      </Card>
      {/* </div> */}
    </>
  )
}
export default KycUpload;
