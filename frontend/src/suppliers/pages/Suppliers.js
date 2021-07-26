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
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal/ErrorModal";

const Suppliers = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [suppliers, setSuppliers] = useState([]);
  const [q, setQ] = useState("");
  const [searchParams] = useState(["code", "name"]);
  const [showAdd, setShowAdd] = useState(false);
  const [formState, inputHandler] = useForm(
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
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/suppliers`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        if (props.pick) {
          setSuppliers(
            responseData.suppliers.map((supplier) => {
              if (
                props.pickedSuppliers.find(
                  (x) => x.id === supplier.id && x.isSelected === true
                )
              ) {
                return { ...supplier, isSelected: true };
              } else {
                return { ...supplier, isSelected: false };
              }
            })
          );
        } else {
          setSuppliers(responseData.suppliers);
        }
      } catch (error) {}
    };
    fetchAll();
  }, [props.pick, sendRequest, auth.token]);

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
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/suppliers`,
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      setSuppliers(responseData.suppliers);
    } catch (error) {}
    setShowAdd(false);
  };

  const selectSupplierHandler = (supplierId) => {
    const supplierIndex = suppliers.findIndex((s) => s.id === supplierId);
    const newArray = [...suppliers];
    newArray[supplierIndex].isSelected = !newArray[supplierIndex].isSelected;
    setSuppliers((prevState) => (prevState = newArray));
  };

  const addSelectedSuppliersHandler = () => {
    props.onSelectedSuppliers(
      suppliers
        .filter((supplier) => supplier.isSelected)
        .map((supplier) => ({ ...supplier, isSelected: undefined }))
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
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
        {isLoading && <LoadingSpinner asOverlay />}
        {!isLoading && suppliers.length > 0 && (
          <SuppliersList
            pick={props.pick}
            suppliers={search(suppliers)}
            selectSupplier={selectSupplierHandler}
          />
        )}
        {!isLoading && suppliers.length === 0 && (
          <h3 style={{ textAlign: "center", margin: "2rem" }}>
            No suppliers added yet.
          </h3>
        )}
        {!props.pick && (
          <div className="suppliers__add">
            <Button type="button" wide onClick={addSupplierHandler}>
              ADD NEW
            </Button>
          </div>
        )}
        {props.pick && (
          <div className="suppliers__add">
            <Button type="button" wide onClick={addSelectedSuppliersHandler}>
              {suppliers.length > 0 && "ADD SUPPLIERS"}
              {suppliers.length === 0 && "GO BACK"}
            </Button>
          </div>
        )}
      </Card>
    </React.Fragment>
  );
};

export default Suppliers;
