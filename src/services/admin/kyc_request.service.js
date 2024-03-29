import { authHeader } from '../../_helpers';
import { notify, handleResponse, setLoading } from '../../_helpers/';
require('dotenv').config();


/*************** Export Functions Defined For Services ******************************/

export const kycRequestService = {
    getList,
    getDetail,
    updateRequest,
    detailview,
};

/*********************  Get List of All Pages from Database By - vivek bisht  *****************************/

function getList(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader('kyc_requests', 'view'),
        body: JSON.stringify(postData)
    };

    // return fetch(`${process.env.REACT_APP_KYC_URL}kyc/index`, requestOptions).catch((error) => {
    // return fetch(`http://sare.api/api/kyc/index`, requestOptions).catch((error) => {
    return fetch(`${process.env.REACT_APP_API_URL}api/kyc/index`, requestOptions).catch((error) => {
        console.log('error', error);
        notify.error('Something went wrong');
        setLoading(true);
    }).then(handleResponse);
}

/****************** Retrieve Single Record From Server ************************/

function getDetail(id) {
    setLoading(true);
    const requestOptions = {
        method: 'GET',
        headers: authHeader('kyc_requests', 'view')
    };

    return fetch(`${process.env.REACT_APP_API_URL}api/kyc/${id}`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}


/***********************  Retrive Api For Update from server  *****************************/

function updateRequest(id, postData) {
    setLoading(true);
    const requestOptions = {
        method: 'PUT',
        headers: authHeader('kyc_requests', 'update'),
        body: JSON.stringify(postData)
    };

    return fetch(`${process.env.REACT_APP_API_URL}api/kyc/${id}`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}

/********************** Retrieve Api for Detail view of Post from server   *****************************/
function detailview(id) {
    setLoading(true);
    const requestOptions = {
        method: 'GET',
        headers: authHeader('kyc_requests', 'view')
    };
    return fetch(`${process.env.REACT_APP_API_URL}api/kyc/${id}`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}
