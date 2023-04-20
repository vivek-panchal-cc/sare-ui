import { authHeader } from "../../_helpers";
import { notify, handleResponse, setLoading } from "../../_helpers";
require("dotenv").config();

export const bankService = {  
  getBankDetails,
  updateBankDetails
};

async function getBankDetails(postData) {
  setLoading(true);
  const requestOptions = {
    method: "GET",
    headers: authHeader("bank_details", "view"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/bank-details`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    const response = undefined;
  }
  return handleResponse(response);
}

async function updateBankDetails(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("bank_details", "update"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/bank-details/add`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    const response = undefined;
  }
  return handleResponse(response);
}