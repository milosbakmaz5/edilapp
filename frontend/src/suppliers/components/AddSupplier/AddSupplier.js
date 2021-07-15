import React, { useContext } from "react";
import { useForm } from "../../../shared/hooks/form-hook";
import { VALIDATOR_REQUIRE } from "../../../shared/util/validators";
import Modal from "../../../shared/components/UIElements/Modal/Modal";
import Button from "../../../shared/components/FormElements/Button/Button";
import Input from "../../../shared/components/FormElements/Input/Input";

import "./AddSupplier.scss";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal/ErrorModal";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

const AddSupplier = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler, setFormData] = useForm(
    {
      code: {
        value: "",
        isValid: false,
      },
      name: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        "http://localhost:5000/api/suppliers",
        "POST",
        JSON.stringify({
          code: formState.inputs.code.value,
          name: formState.inputs.name.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onSubmit();
    } catch {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        onCancel={props.onCancel}
        onSubmit={submitHandler}
        header="Suppliers information"
        show={props.show}
        headerClass="add-supplier__header"
        footerClass="add-supplier__footer"
        footer={
          <div className="add-supplier__buttons">
            <Button inverse onClick={props.onCancel}>
              CANCEL
            </Button>
            <Button type="submit" disabled={!formState.isValid}>
              {!isLoading && "ADD"}
              {isLoading && "Adding..."}
            </Button>
          </div>
        }
      >
        <Input
          id="code"
          element="input"
          type="text"
          onInput={inputHandler}
          label="Code:"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Code is required."
        />
        <Input
          id="name"
          element="input"
          type="text"
          onInput={inputHandler}
          label="Name:"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Name is required."
        />
      </Modal>
    </React.Fragment>
  );
};

export default AddSupplier;
