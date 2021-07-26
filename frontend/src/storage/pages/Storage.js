import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useForm } from "../../shared/hooks/form-hook";

import Card from "../../shared/components/UIElements/Card/Card";
import Input from "../../shared/components/FormElements/Input/Input";
import ErrorModal from "../../shared/components/UIElements/ErrorModal/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner/LoadingSpinner";
import ItemsList from "../components/ItemsList/ItemsList";
import { Link } from "react-router-dom";

const Storage = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [q, setQ] = useState("");
  const [searchParams] = useState(["productionName", "financeName"]);
  const [searchSuppliersParams] = useState(["name", "code"]);
  const [formState, inputHandler] = useForm(
    {
      search: {
        value: "",
        isValid: true,
      },
    },
    true
  );
  const [items, setItems] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/items`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setItems(responseData.items);
      } catch (error) {}
    };
    fetch();
  }, [sendRequest, auth.token]);

  const search = (items) => {
    const result = items.filter((item) => {
      if (
        searchParams.some((newItem) => {
          return (
            item[newItem]
              .toString()
              .toLowerCase()
              .indexOf(formState.inputs.search.value.toLowerCase()) > -1
          );
        })
      ) {
        return true;
      } else {
        let retVal = false;
        item.suppliers.forEach((supplier) => {
          searchSuppliersParams.some((newSupp) => {
            if (
              supplier[newSupp]
                .toString()
                .toLowerCase()
                .indexOf(formState.inputs.search.value.toLowerCase()) > -1
            ) {
              retVal = true;
            }
          });
        });
        return retVal;
      }
    });
    return result;
  };

  const deleteItemHandler = (itemId) => {
    setItems((prevState) => prevState.filter((item) => item.id !== itemId));
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="suppliers__container">
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
        {!isLoading && items.length > 0 && (
          <ItemsList items={search(items)} onDeleteItem={deleteItemHandler} />
        )}
        {!isLoading && items.length === 0 && (
          <h3 style={{ textAlign: "center", margin: "2rem" }}>
            No items added yet.
            <br />
            Add them <Link to="/storage/new">here</Link>.
          </h3>
        )}
      </Card>
    </React.Fragment>
  );
};

export default Storage;
