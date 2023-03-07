import { authHeader, notify, handleResponse, setLoading, authHeaderMutlipart, authHeaderMutlipartFile } from '../../_helpers/';
require('dotenv').config();

export const kycService = {
  checkStatus,
  validateOtp,
  resendOtp,
  getKycDetails,
  uploadFile,
  store
};

function checkStatus(postData) {
  setLoading(true);
  const requestOptions = {
    method: 'POST',
    headers: authHeaderMutlipart(),
    // body: postData,
    body: JSON.stringify(postData),
  };

  return fetch(`${process.env.REACT_APP_KYC_URL}kyc/checkStatus`, requestOptions).catch((error) => {
    notify.error('Something went wrong');
    setLoading(false);
  }).then(handleResponse);
}

function validateOtp(postData) {
  setLoading(true);
  const requestOptions = {
    method: 'POST',
    headers: authHeaderMutlipart(),
    // body: postData,
    body: JSON.stringify(postData),
  };

  return fetch(`${process.env.REACT_APP_KYC_URL}kyc/validateOTP`, requestOptions).catch((error) => {
    notify.error('Something went wrong');
    setLoading(false);
  }).then(handleResponse);
}

function resendOtp(postData) {
  setLoading(true);
  const requestOptions = {
    method: 'POST',
    headers: authHeaderMutlipart(),
    // body: postData,
    body: JSON.stringify(postData),
  };

  return fetch(`${process.env.REACT_APP_KYC_URL}kyc/resendOTP`, requestOptions).catch((error) => {
    notify.error('Something went wrong');
    setLoading(false);
  }).then(handleResponse);
}

function getKycDetails(postData) {
  setLoading(true);
  const requestOptions = {
    method: 'POST',
    headers: authHeaderMutlipart(),
    // body: postData,
    body: JSON.stringify(postData),
  };

  return fetch(`${process.env.REACT_APP_KYC_URL}kyc/getKycDetails`, requestOptions).catch((error) => {
    notify.error('Something went wrong');
    setLoading(false);
  }).then(handleResponse);
}

function uploadFile(postData) {

  setLoading(true);
  const requestOptions = {
    method: 'POST',
    headers: authHeaderMutlipartFile(),
    body: postData
  };

  return fetch(`${process.env.REACT_APP_KYC_URL}kyc/uploadFile`, requestOptions).catch((error) => {
    notify.error('Something went wrong');
    setLoading(false);
  }).then(handleResponse);
}

function store(postData) {
  setLoading(true);
  const requestOptions = {
    method: 'POST',
    headers: authHeaderMutlipart(),
    // body: postData,
    body: JSON.stringify(postData),
  };

  return fetch(`${process.env.REACT_APP_KYC_URL}kyc/store`, requestOptions).catch((error) => {
    notify.error('Something went wrong');
    setLoading(false);
  }).then(handleResponse);
}
