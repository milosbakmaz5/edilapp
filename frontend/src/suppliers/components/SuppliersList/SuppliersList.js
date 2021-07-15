import React from "react";
import Pagination from "../../../shared/components/UIElements/Pagination/Pagination";
import Card from "../../../shared/components/UIElements/Card/Card";
import Supplier from "../Supplier/Supplier";

import "./SuppliersList.scss";

const SuppliersList = (props) => {
  if (!props.suppliers || props.suppliers.length === 0) {
    return (
      <Card>
        <h3>No results found.</h3>
      </Card>
    );
  }

  return (
    <React.Fragment>
      <div className="suppliers-list__header">
        <p>CODE</p>
        <p>NAME</p>
      </div>
      <div className="suppliers-list__container">
        <Pagination
          data={props.suppliers}
          RenderComponent={Supplier}
          pageLimit={3}
          dataLimit={10}
        />
      </div>
    </React.Fragment>
  );
};

export default SuppliersList;
