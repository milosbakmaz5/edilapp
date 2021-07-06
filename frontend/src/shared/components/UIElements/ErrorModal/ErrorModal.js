import React from "react";

import Modal from "../Modal/Modal";
import Button from "../../FormElements/Button/Button";

const ErrorModal = (props) => {
  return (
    <Modal
      onCancel={props.onClear}
      header="An Error Occurred!"
      show={!!props.error}
      headerClass="modal__header_error"
      footer={
        <Button right inverse onClick={props.onClear}>
          OK
        </Button>
      }
    >
      <p>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;
