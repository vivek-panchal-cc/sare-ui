import { authHeader, notify, handleResponse } from '../../_helpers/';
require('dotenv').config();

export const kycService = {
  getKycDetails
};

function getKycDetails(mobile) {
  return ({
    "status": true,
    "data": {
      "id": 4,
      "mobile": "9876543210",
      "kyc_status": 'pending', //pending, pending_approval, rejected, approved
      "documents": [
        'abcd.pdf'
      ],
      "_id": 4
    }
  });
  // const requestOptions = {
  //     method: 'GET',
  //     headers: authHeader()
  // };
  // return fetch(`${process.env.REACT_APP_API_URL}api/frontend/cms_pages/${mobile}`, requestOptions).catch((error) => {
  //     notify.error('Something went wrong');
  //     return Promise.reject();
  // }).then(handleResponse);
}
