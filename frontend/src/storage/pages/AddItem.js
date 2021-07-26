import React, { useContext, useState } from "react";
import Input from "../../shared/components/FormElements/Input/Input";
import ImageUpload from "../../shared/components/FormElements/ImageUpload/ImageUpload";
import {
  VALIDATOR_MAX,
  VALIDATOR_MIN,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import ErrorModal from "../../shared/components/UIElements/ErrorModal/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Button from "../../shared/components/FormElements/Button/Button";
import Card from "../../shared/components/UIElements/Card/Card";
import SuppliersList from "../../suppliers/components/SuppliersList/SuppliersList";

import "./AddItem.scss";
import Suppliers from "../../suppliers/pages/Suppliers";

const AddItem = (props) => {
  const auth = useContext(AuthContext);
  const [selectedSuppliers, setSelectedSuppliers] = useState(
    props.item
      ? props.item.suppliers.map((supplier) => ({
          ...supplier,
          isSelected: true,
        }))
      : []
  );
  const [isPickingSuppliers, setIsPickingSuppliers] = useState(false);
  const [errorSuppliers, setErrorSuppliers] = useState("");
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      productionName: {
        value: props.item ? props.item.productionName : "",
        isValid: (props.item && true) || false,
      },
      financeName: {
        value: props.item ? props.item.financeName : "",
        isValid: (props.item && true) || false,
      },
      measure: {
        value: props.item ? props.item.measure : "",
        isValid: (props.item && true) || false,
      },
      weight: {
        value: props.item ? props.item.productionName : 0,
        isValid: (props.item && true) || false,
      },
      image: {
        value: "",
        isValid: true,
      },
      price: {
        value: props.item ? props.item.price : "",
        isValid: (props.item && true) || false,
      },
    },
    false
  );

  const checkIfSupplierIsSelected = () => {
    let retVal = false;
    selectedSuppliers.forEach((supp) => {
      if (supp.isSelected) {
        retVal = true;
      }
    });
    return retVal;
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (selectedSuppliers.length === 0 || !checkIfSupplierIsSelected()) {
      setErrorSuppliers("Please pick suppliers first.");
      return;
    }
    if (!props.item) {
      const formData = new FormData();
      formData.append("productionName", formState.inputs.productionName.value);
      formData.append("financeName", formState.inputs.financeName.value);
      formData.append("measure", formState.inputs.measure.value);
      formData.append("weight", formState.inputs.weight.value);
      formData.append("image", formState.inputs.image.value);
      formData.append("price", formState.inputs.price.value);
      formData.append(
        "suppliers",
        JSON.stringify(
          selectedSuppliers.map((supplier) => {
            return {
              id: supplier.id,
            };
          })
        )
      );
      try {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/items`,
          "POST",
          formData,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
      } catch {}
    } else {
      try {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/items/${props.item.id}`,
          "PATCH",
          JSON.stringify({
            productionName: formState.inputs.productionName.value,
            financeName: formState.inputs.financeName.value,
            measure: formState.inputs.measure.value,
            weight: formState.inputs.weight.value,
            price: formState.inputs.price.value,
            suppliers: selectedSuppliers
              .filter((x) => x.isSelected === true)
              .map((supplier) => {
                return {
                  id: supplier.id,
                };
              }),
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
      } catch {}
    }
  };

  const pickSuppliersHandler = () => {
    setIsPickingSuppliers(true);
  };

  const selectedSuppliersHandler = (newSelectedsuppliers) => {
    setIsPickingSuppliers(false);
    setSelectedSuppliers((prevState) => {
      return newSelectedsuppliers.map((supplier) => ({
        ...supplier,
        isSelected: true,
      }));
    });
  };

  const selectSupplierHandler = (supplierId) => {
    const supplierIndex = selectedSuppliers.findIndex(
      (s) => s.id === supplierId
    );
    const newArray = [...selectedSuppliers];

    newArray[supplierIndex].isSelected = !newArray[supplierIndex].isSelected;
    setSelectedSuppliers((prevState) => (prevState = newArray));
  };

  const clearErrorSuppliers = () => {
    setErrorSuppliers("");
  };

  return (
    <React.Fragment>
      <ErrorModal
        error={errorSuppliers.trim("").length > 0 ? errorSuppliers : null}
        onClear={clearErrorSuppliers}
      />
      {isPickingSuppliers && (
        <div className="overlay">
          <Suppliers
            pick={true}
            pickedSuppliers={selectedSuppliers}
            onSelectedSuppliers={selectedSuppliersHandler}
          />
        </div>
      )}
      <Card
        className={`add-item__container ${
          isPickingSuppliers && "add-item__container_none"
        }`}
      >
        {!props.item && <h2>Add new item.</h2>}
        {props.item && <h2>Update item.</h2>}
        <ErrorModal error={error} onClear={clearError} />
        <form onSubmit={submitHandler}>
          <Input
            id="productionName"
            element="input"
            type="text"
            onInput={inputHandler}
            label="Production Name:"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Production name is required."
            initialValue={props.item ? props.item.productionName : ""}
            initialValid={props.item ? true : false}
          />
          <Input
            id="financeName"
            element="input"
            type="text"
            onInput={inputHandler}
            label="Finance Name:"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Finance name is required."
            initialValue={props.item ? props.item.financeName : ""}
            initialValid={props.item ? true : false}
          />
          <Input
            id="measure"
            element="input"
            type="text"
            onInput={inputHandler}
            label="Measure:"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Measure is required."
            initialValue={props.item ? props.item.measure : null}
            initialValid={props.item ? true : false}
          />
          <Input
            id="weight"
            element="input"
            type="number"
            onInput={inputHandler}
            label="Weight (grams):"
            validators={[VALIDATOR_MIN(0), VALIDATOR_MAX(1000000)]}
            errorText="Weight should be 0-1000000."
            initialValue={props.item ? props.item.weight : null}
            initialValid={props.item ? true : false}
          />
          <Input
            id="price"
            element="input"
            type="number"
            onInput={inputHandler}
            label="Price:"
            validators={[VALIDATOR_MIN(0), VALIDATOR_MAX(1000000)]}
            errorText="Price should be 0-1000000."
            initialValue={props.item ? props.item.price : null}
            initialValid={props.item ? true : false}
          />
          <div className="add-item__add">
            <Button type="button" wide onClick={pickSuppliersHandler}>
              PICK SUPPLIERS HERE
            </Button>
          </div>
          {selectedSuppliers.length > 0 && (
            <div className="add-item__selected-suppliers">
              <SuppliersList
                pick={true}
                suppliers={selectedSuppliers}
                selectSupplier={selectSupplierHandler}
              />
            </div>
          )}
          {!props.item && (
            <ImageUpload
              center
              id="image"
              onInput={inputHandler}
              errorText="Please provide an image."
            />
          )}
          <div className="add-item__add">
            <Button wide type="submit" disabled={!formState.isValid}>
              {!isLoading && "ADD"}
              {isLoading && "Adding..."}
            </Button>
          </div>
        </form>
      </Card>
    </React.Fragment>
  );
};

export default AddItem;
