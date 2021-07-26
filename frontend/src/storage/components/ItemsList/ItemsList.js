import React from "react";

import Card from "../../../shared/components/UIElements/Card/Card";
import Pagination from "../../../shared/components/UIElements/Pagination/Pagination";
import Item from "../Item/Item";

import "./ItemsList.scss";

const ItemsList = (props) => {
  if (!props.items || props.items.length === 0) {
    return (
      <Card>
        <h3>No results found.</h3>
      </Card>
    );
  }

  return (
    <React.Fragment>
      <div className="suppliers-list__container">
        <Pagination
          data={props.items}
          RenderComponent={Item}
          pageLimit={3}
          dataLimit={10}
          deleteItemHandler={props.onDeleteItem}
        />
      </div>
    </React.Fragment>
  );
};

export default ItemsList;
