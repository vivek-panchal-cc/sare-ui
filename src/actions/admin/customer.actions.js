import { customerConstants } from "../../constants/admin";
import { customerService } from "../../services/admin";
import { alertActions } from "./";
import { history, notify } from "../../_helpers";

/* export const customerActions = {
  getCustomersList,
}; */

export function getCustomersList(filterVal) {
  return (dispatch) => {
    dispatch(request());
    customerService.getCustomersList(filterVal).then(
      (customers) => {        
        if (customers.success) {
          dispatch(success(customers));
          return customers;
        } else {
          notify.error(customers.message);
          dispatch(alertActions.error(customers.message));
        }
      },
      (error) => {
        dispatch(failure(error));
      }
    );
  };

  function request() {
    return { type: customerConstants.GETALL_REQUEST };
  }
  function success(customers) {
    return { type: customerConstants.GETALL_SUCCESS, customers };
  }
  function failure(error) {
    return { type: customerConstants.GETALL_FAILURE, error };
  }
}
