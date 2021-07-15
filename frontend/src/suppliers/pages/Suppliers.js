import React, { useState, useEffect, useContext } from "react";
import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UIElements/Card/Card";
import Input from "../../shared/components/FormElements/Input/Input";
import Button from "../../shared/components/FormElements/Button/Button";
import SuppliersList from "../components/SuppliersList/SuppliersList";

import "./Suppliers.scss";
import AddSupplier from "../components/AddSupplier/AddSupplier";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const Suppliers = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [suppliers, setSuppliers] = useState([]);
  const [q, setQ] = useState("");
  const [searchParams] = useState(["code", "name"]);
  const [showAdd, setShowAdd] = useState(false);
  const [formState, inputHandler, setFormData] = useForm(
    {
      search: {
        value: "",
        isValid: true,
      },
    },
    true
  );

  useEffect(() => {
    const fetchAll = async () => {
      const responseData = await sendRequest(
        "http://localhost:5000/api/suppliers",
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      setSuppliers(responseData.suppliers);
    };
    fetchAll();
  }, []);

  const search = (items) => {
    return items.filter((item) => {
      return searchParams.some((newItem) => {
        return (
          item[newItem]
            .toString()
            .toLowerCase()
            .indexOf(formState.inputs.search.value.toLowerCase()) > -1
        );
      });
    });
  };

  const addSupplierHandler = () => {
    setShowAdd(true);
  };
  const cancelHandler = () => {
    setShowAdd(false);
  };
  const addHandler = async () => {
    const responseData = await sendRequest(
      "http://localhost:5000/api/suppliers",
      "GET",
      null,
      {
        Authorization: "Bearer " + auth.token,
      }
    );
    setSuppliers(responseData.suppliers);
    setShowAdd(false);
  };

  return (
    <Card className="suppliers__container">
      <AddSupplier
        show={showAdd}
        onCancel={cancelHandler}
        onSubmit={addHandler}
      />
      <div className="suppliers__search">
        <Input
          id="search"
          element="input"
          type="text"
          initialValue={q}
          initialValid={true}
          onInput={inputHandler}
          validators={[]}
          label="Search here..."
        />
      </div>
      {!isLoading && suppliers.length > 0 && (
        <SuppliersList suppliers={search(suppliers)} />
      )}
      {!isLoading && suppliers.length === 0 && <h3>No suppliers added yet.</h3>}
      <div className="suppliers__add">
        <Button wide onClick={addSupplierHandler}>
          ADD NEW
        </Button>
      </div>
    </Card>
  );
};

export default Suppliers;
