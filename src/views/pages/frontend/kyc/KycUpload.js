import { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";

// reactstrap components
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
  CardTitle,
  Table,
} from "reactstrap";
import { kycService } from "../../../../services/frontend/kyc.service";
import { notify, history } from "../../../../_helpers/index";

function KycUpload() {
  const [comment, setComment] = useState("");
  const [maxUploadFiles, setMaxUploadFiles] = useState(0);
  const [remainingUploadFiles, setRemainingUploadFiles] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const urlData = useRouteMatch({
    path: "/kyc/:mobile/:secretId",
    strict: true,
    sensitive: true,
  });

  useEffect(() => {
    getKycDetails();
  }, [maxUploadFiles]);

  function getKycDetails() {
    kycService
      .getKycDetails({
        mobile_number: urlData.params.mobile,
        mobile_key: urlData.params.secretId,
      })
      .then((res) => {
        if (res.status === false) {
          notify.error(res.message);
          history.push("/kyc/failure");
        } else {
          const min_files = res.data.min_files ?? 0;
          const total_files = res.data.kyc_files.length ?? 0;
          const remaining_files = min_files - total_files;
          setMaxUploadFiles(min_files);
          setRemainingUploadFiles(remaining_files);
          setUploadedFiles(res.data.kyc_files);
        }
      });
  }

  function uploadKycFile(event) {
    let formData = new FormData();
    formData.append("mobile_number", urlData.params.mobile);
    formData.append("otp_key", urlData.params.secretId);
    formData.append("file", event.target.files[0], "test.pdf");

    kycService.uploadFile(formData).then((res) => {
      console.log("res", res);
      if (res.status === false) {
        notify.error(res.message);
      } else {
        getKycDetails();
        notify.success(res.message);
      }
    });
  }

  function changeKycFile(event, file_id) {
    let formData = new FormData();
    formData.append("mobile_number", urlData.params.mobile);
    formData.append("otp_key", urlData.params.secretId);
    formData.append("file_id", file_id);
    formData.append("file", event.target.files[0], "test.pdf");

    kycService.uploadFile(formData).then((res) => {
      console.log("res", res);
      if (res.status === false) {
        notify.error(res.message);
      } else {
        getKycDetails();
        notify.success(res.message);
      }
    });
  }

  function submitKyc() {
    kycService
      .store({
        mobile_number: urlData.params.mobile,
        mobile_key: urlData.params.secretId,
        user_comment: comment,
      })
      .then((res) => {
        if (res.status === false) {
          notify.error(res.message);
          history.push("/kyc/failure");
        } else {
          history.push("/kyc/recieved");
        }
      });
  }

  return (
    <>
      <Card className="col-md-6 offset-md-3 text-center">
        <CardBody>
          <CardTitle>
            <b>Upload Kyc Documents</b>
          </CardTitle>
          <CardBody>
            <br />
            <Form>
              <FormGroup>
                <Label for="comment">
                  <b>Comment:</b>
                </Label>
                <Input
                  id="comment"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                  name="text"
                  type="textarea"
                />
              </FormGroup>
              <FormGroup>
                <Label>
                  <b>Files:</b>
                </Label>
              </FormGroup>
              <Table>
                <tbody>
                  {(() => {
                    let remainingContainer = [];
                    for (let i = 0; i < remainingUploadFiles; i++) {
                      remainingContainer.push(
                        <tr key={i}>
                          <th scope="row" colSpan={3}>
                            <Input
                              name="file"
                              type="file"
                              onChange={uploadKycFile}
                            />
                          </th>
                        </tr>
                      );
                    }
                    return remainingContainer;
                  })()}
                  {uploadedFiles.map((uploadedFile, i) => {
                    // return <li key={i}>{uploadedFile}</li>
                    return (
                      <tr key={i}>
                        {uploadedFile.file_status !== "approved" ? (
                          <th scope="row">
                            <Input
                              name="file"
                              type="file"
                              id={uploadedFile.id}
                              onChange={(e) =>
                                changeKycFile(e, uploadedFile.id)
                              }
                            />
                          </th>
                        ) : (
                          <th scope="row"></th>
                        )}
                        <td>
                          <a target="_blank" href={uploadedFile.file}>
                            <b>View</b>
                          </a>
                        </td>
                        <td>
                          <b>Status : {uploadedFile.file_status}</b>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <Button
                className="btn-round"
                color="info"
                onClick={() => submitKyc()}
              >
                Submit
              </Button>
            </Form>
            <br />
          </CardBody>
        </CardBody>
      </Card>
    </>
  );
}
export default KycUpload;
