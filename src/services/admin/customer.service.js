import { authHeader, authHeaderFile } from "../../_helpers";
import { notify, handleResponse, setLoading } from "../../_helpers/";
import moment from "moment";
require("dotenv").config();

export const customerService = {
  getCustomersList,
  getCustomerDetails,
  updateCustomerDetails,
  deleteCustomer,
  changeBulkCustomersStatus,
  deleteMultipleCustomers,
  changeCustomerStatus,
  customerTransactionDetails
};

async function getCustomersList(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("customers", "view"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/customers`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
  }
  return handleResponse(response);
}

async function getCustomerDetails(id) {
  setLoading(true);
  const requestOptions = {
    method: "GET",
    headers: authHeader("customers", "view"),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/customers/${id}`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function updateCustomerDetails(postData, custId) {  
  setLoading(true);
  const requestOptions = {
    method: "POST",    
    headers: authHeaderFile("customers", "update"),
    body: postData,
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/customers/${custId}`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function deleteCustomer(id) {
  setLoading(true);
  const requestOptions = {
    method: "DELETE",
    headers: authHeader("customers", "delete"),
  };
  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/customers/${id}`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function changeBulkCustomersStatus(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("customers", "update"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/customers/change_bulk_customers_status`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function deleteMultipleCustomers(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("customers", "delete"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/delete_multiple_customers`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function changeCustomerStatus(id, postData) {
  setLoading(true);
  const requestOptions = {
    method: "PUT",
    headers: authHeader("customers", "edit"),
    body: JSON.stringify(postData),
  };
  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/customers/${id}/change-status`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function customerTransactionDetails(id, postData) {  
  const fromDate = moment(postData?.from).format("DD/MM/YYYY");
  const toDate = moment(postData?.to).format("DD/MM/YYYY");
  if (fromDate === 'Invalid date' || toDate === 'Invalid date') {
    postData.from = "";
    postData.to = "";
  } 
  else if (postData) {
    postData.from = fromDate;
    postData.to = toDate;
  }  
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("customers", "view"),
    body: JSON.stringify(postData),
  };
  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/customers/${id}/transactions`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}