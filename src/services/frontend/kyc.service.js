import {
  notify,
  handleResponse,
  setLoading,
  frontHeader,  
  authHeaderMutlipartFile
} from "../../_helpers/";
require("dotenv").config();

export const kycService = {
  checkStatus,
  validateOtp,
  resendOtp,
  getKycDetails,
  uploadFile,
  store,
};

function checkStatus(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: frontHeader(),
    // body: postData,
    body: JSON.stringify(postData),
  };

  return fetch(
    `${process.env.REACT_APP_KYC_API}kyc/checkStatus`,
    requestOptions
  )
    .catch(() => {
      notify.error("Something went wrong");
      setLoading(false);
    })
    .then(handleResponse);
}

async function validateOtp(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: frontHeader(),
    // body: postData,
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_KYC_API}kyc/validateOTP`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
  }
  return handleResponse(response);
}

function resendOtp(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: frontHeader(),
    // body: postData,
    body: JSON.stringify(postData),
  };

  return fetch(`${process.env.REACT_APP_KYC_API}kyc/resendOTP`, requestOptions)
    .catch(() => {
      notify.error("Something went wrong");
      setLoading(false);
    })
    .then(handleResponse);
}

function getKycDetails(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: frontHeader(),
    // body: postData,
    body: JSON.stringify(postData),
  };  

  return fetch(
    `${process.env.REACT_APP_KYC_API}kyc/getKycDetails`,
    requestOptions
  )
    .catch(() => {
      notify.error("Something went wrong");
      setLoading(false);
    })
    .then(handleResponse);
}

function uploadFile(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeaderMutlipartFile(),
    body: postData,
  };

  return fetch(`${process.env.REACT_APP_KYC_API}kyc/uploadFile`, requestOptions)
    .catch(() => {
      notify.error("Something went wrong");
      setLoading(false);
    })
    .then(handleResponse);
}

async function store(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    // headers: authHeaderMutlipartFile(),
    body: postData,
  };

  let response;
  try {    
    response = await fetch(`${process.env.REACT_APP_KYC_API}kyc/store`, requestOptions);
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
  }
  return handleResponse(response);
}