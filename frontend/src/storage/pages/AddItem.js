import React from "react";
import { useForm } from "../../shared/hooks/form-hook";

const AddItem = () => {
  const [formState, inputHandler, setFormData] = useForm(
    {
      productionName: {
        value: "",
        isValid: false,
      },
      financeName: {
        value: "",
        isValid: false,
      },
      measure: {
        value: "",
        isValid: false,
      },
      supplierCode: {
        value: "",
        isValid: false,
      },
      supplier: {
        value: "",
        isValid: false,
      },
      count: {
        value: 0,
        isValid: false,
      },
      image: {
        value: "",
        isValid: false,
      },
      price: {
        value: 0,
        isValid: false,
      },
    },
    false
  );

  return <div>hi from add item</div>;
};

export default AddItem;
