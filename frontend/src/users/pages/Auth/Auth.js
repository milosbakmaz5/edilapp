import React from "react";

import Card from "../../../shared/components/UIElements/Card/Card";
import Input from "../../../shared/components/FormElements/Input/Input";
import Button from "../../../shared/components/FormElements/Button/Button";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../../shared/util/validators";

import "./Auth.scss";

const Auth = () => {
  const authSubmitHandler = () => {};
  const inputHandler = () => {};

  return (
    <Card className="auth__card">
      <form onSubmit={authSubmitHandler}>
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
        <Button type="submit">LOG IN</Button>
      </form>
    </Card>
  );
};

export default Auth;
