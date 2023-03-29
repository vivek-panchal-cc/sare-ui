import {
  authHeader,
  notify,
  handleResponse,
  setLoading,
  authHeaderMutlipart,
  authHeaderMutlipartFile,
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
    headers: authHeaderMutlipart(),
    // body: postData,
    body: JSON.stringify(postData),
  };

  return fetch(
    `${process.env.REACT_APP_KYC_API}kyc/checkStatus`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
    })
    .then(handleResponse);
}

async function validateOtp(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeaderMutlipart(),
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
    const response = undefined;
  }
  return handleResponse(response);
}

function resendOtp(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeaderMutlipart(),
    // body: postData,
    body: JSON.stringify(postData),
  };

  return fetch(`${process.env.REACT_APP_KYC_API}kyc/resendOTP`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
    })
    .then(handleResponse);
}

function getKycDetails(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeaderMutlipart(),
    // body: postData,
    body: JSON.stringify(postData),
  };

  return fetch(
    `${process.env.REACT_APP_KYC_API}kyc/getKycDetails`,
    requestOptions
  )
    .catch((error) => {
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
    .catch((error) => {
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
    console.log("Req", requestOptions)
    response = await fetch(`${process.env.REACT_APP_KYC_API}kyc/store`, requestOptions);
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    const response = undefined;
  }
  return handleResponse(response);
}

// async function store(postData) {
//   const formData = new FormData();
//   formData.append("kyc_token", postData.mobile);
//   formData.append("mobile_key", postData.secret_key);
//   formData.append("name", postData.fullName);
//   formData.append("email", postData.email);
//   formData.append("house_number", postData.houseNumber);
//   formData.append("street_name", postData.streetName);
//   formData.append("landmark", postData.landmark);
//   formData.append("city", postData.city);
//   formData.append("pincode", postData.pincode);
//   // formData.append("file", postData.formData1);
//   formData.append("id_number", postData.idNumber);
//   formData.append("id_expiration_date", postData.idExpirationDate);
//   setLoading(true);
//   const requestOptions = {
//     method: "POST",
//     headers: authHeaderMutlipartFile(),
//     // body: postData,
//     body: formData,
//   };

//   let response;
//   try {
//     response = await fetch(
//       `${process.env.REACT_APP_KYC_API}kyc/store`,
//       requestOptions
//     );
//   } catch (error) {
//     notify.error("Something went wrong");
//     setLoading(false);
//     const response = undefined;
//   }
//   return handleResponse(response);
// }
