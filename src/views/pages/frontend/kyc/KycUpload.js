import React, { ChangeEvent, useState } from 'react'

// reactstrap components
import { Button, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";

function KycUpload() {
  const [firstFile, setFirstFile] = useState();

  function handleFirstFileChange(event) {
    setFirstFile(event.target.files[0])
  }
  console.log("firstFile", firstFile);
  return (
    <>
      <Row>
        <Col className="ml-auto mr-auto" md="8">
          <h2 className="title">Kyc Upload:</h2>
          <Form>
            <FormGroup>
              <Label for="exampleText">Comment:</Label>
              <Input id="exampleText" name="text" type="textarea" />
            </FormGroup>
            <FormGroup>
              <Label for="exampleFile">Files:</Label>
              <Input id="exampleFile" name="file" type="file" onChange={handleFirstFileChange} />
            </FormGroup>
            <FormGroup>
              <Input id="exampleFile" name="file" type="file" />
            </FormGroup>
            <FormGroup>
              <Input id="exampleFile" name="file" type="file" />
            </FormGroup>
            <Button>
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </>
  )
}
export default KycUpload;
