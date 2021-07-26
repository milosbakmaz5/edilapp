import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorModal from "../../shared/components/UIElements/ErrorModal/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import AddItem from "./AddItem";

const UpdateItem = () => {
  const auth = useContext(AuthContext);
  const itemId = useParams().id;
  const [item, setItem] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  useEffect(() => {
    const fetchItem = async () => {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/items/${itemId}`,
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      setItem(responseData.item);
    };
    fetchItem();
  }, [auth.token, sendRequest, itemId]);

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClear={clearError} />
      {item && !isLoading && <AddItem item={item} />}
    </React.Fragment>
  );
};

export default UpdateItem;
