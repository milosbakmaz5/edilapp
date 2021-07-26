import React, { useContext, useState } from "react";
import jwt_decode from "jwt-decode";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { useForm } from "../../../shared/hooks/form-hook";
import { AuthContext } from "../../../shared/context/auth-context";

import Card from "../../../shared/components/UIElements/Card/Card";
import Input from "../../../shared/components/FormElements/Input/Input";
import Button from "../../../shared/components/FormElements/Button/Button";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../../shared/util/validators";

import "./Auth.scss";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal/ErrorModal";
import Modal from "../../../shared/components/UIElements/Modal/Modal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner/LoadingSpinner";
import { Redirect, useParams } from "react-router";

const Auth = () => {
  const hashedValue = useParams().value;
  const auth = useContext(AuthContext);
  const [isLogInMode, setIsLogInMode] = useState(true);
  const [showCofirmEmailMessage, setShowConfirmEmailMessage] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  if (hashedValue && hashedValue.length !== 64) {
    return <Redirect to="/" exact />;
  }
  const authSubmitHandler = async (event) => {
    event.preventDefault();
    if (isLogInMode) {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/login`,
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
            hashedValue: hashedValue,
          }),
          {
            "Content-Type": "application/json",
            // Authorization: `Bearer ` + "nzm",
          }
        );
        if (!jwt_decode(responseData.token).activated) {
          setShowConfirmEmailMessage(true);
        } else {
          auth.login(responseData.userId, responseData.token);
        }
      } catch {}
    } else {
      try {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
            firstname: formState.inputs.firstname.value,
            lastname: formState.inputs.lastname.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        setShowConfirmEmailMessage(true);
      } catch {}
    }
  };
  const switchModeHandler = () => {
    if (!isLogInMode) {
      setFormData(
        {
          ...formState.inputs,
          firstname: undefined,
          lastname: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          firstname: {
            value: "",
            isValid: false,
          },
          lastname: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setIsLogInMode((prevState) => !prevState);
  };

  const closeConfirmEmailHandler = () => {
    setShowConfirmEmailMessage(false);
  };

  return (
    <Card className="auth__card">
      <Modal
        onCancel={closeConfirmEmailHandler}
        header="Confirm email"
        show={showCofirmEmailMessage}
        headerClass="auth__card_modal_headerClass"
        contentClass="auth__card_modal_contentClass"
        footer={
          <Button right inverse onClick={closeConfirmEmailHandler}>
            OK
          </Button>
        }
      >
        <h3>Successfull registration. 🙌</h3>
        Please, confirm your email.
        <br />
        We have sent you a verification link.
      </Modal>
      <ErrorModal onClear={clearError} error={error} />
      {isLoading && <LoadingSpinner asOverlay />}
      <p className="auth__card_header">🐖welcome</p>
      <h1 className="auth__card_main_header">
        {isLogInMode && "SIGN IN"}
        {!isLogInMode && "SIGN UP"}
      </h1>
      <form onSubmit={authSubmitHandler}>
        {!isLogInMode && (
          <Input
            id="firstname"
            element="input"
            type="text"
            onInput={inputHandler}
            label="First Name:"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="First name is required."
          />
        )}
        {!isLogInMode && (
          <Input
            id="lastname"
            element="input"
            type="text"
            onInput={inputHandler}
            label="Last Name:"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Last name is required."
          />
        )}
        <Input
          id="email"
          element="input"
          type="email"
          onInput={inputHandler}
          label="Email:"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email."
        />
        <Input
          id="password"
          element="input"
          type="password"
          onInput={inputHandler}
          label="Password:"
          validators={[VALIDATOR_MINLENGTH(6)]}
          errorText="Password should be at least 6 characters long."
        />
        <Button type="submit" wide disabled={!formState.isValid}>
          {isLogInMode && "LOG IN"}
          {!isLogInMode && "REGISTER"}
        </Button>
      </form>
      <Button onClick={switchModeHandler} size="small" transparent wide>
        {/* https://emojipedia.org/direct-hit/ */}
        {isLogInMode && "Create account here 🎯"}
        {!isLogInMode && "Already have an account? Click here 🎯"}
      </Button>
    </Card>
  );
};

export default Auth;
