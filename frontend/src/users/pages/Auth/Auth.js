import React, { useContext, useState } from "react";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { useForm } from "../../../shared/hooks/form-hook";
import { useAuth } from "../../../shared/hooks/auth-hook";
import { AuthContext } from "../../../shared/context/auth-context";

import Card from "../../../shared/components/UIElements/Card/Card";
import Input from "../../../shared/components/FormElements/Input/Input";
import Button from "../../../shared/components/FormElements/Button/Button";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../../shared/util/validators";

import "./Auth.scss";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLogInMode, setIsLogInMode] = useState(true);
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
  const authSubmitHandler = async (event) => {
    event.preventDefault();
    if (isLogInMode) {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        console.log(responseData);
        //auth.login(responseData.userId, responseData.token);
      } catch {
        console.log("error");
      }
    } else {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/signup",
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
        console.log(responseData);
        //auth.login(responseData.userId, responseData.token);
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

  return (
    <Card className="auth__card">
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
          type="text"
          onInput={inputHandler}
          label="Email:"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Email is required."
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
        <Button type="submit" wide>
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
