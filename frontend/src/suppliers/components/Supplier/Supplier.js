import React from "react";

import "./Supplier.scss";

const Supplier = (props) => {
  return (
    // <tr className={`supplier__container ${props.background ? "darker" : ""}`}>
    //   <td className="supplier__container_code">{props.code}</td>
    //   <td className="supplier__container_name">{props.name}</td>
    // </tr>
    <div className={`supplier__container ${props.background ? "darker" : ""}`}>
      <p className="supplier__container_code">{props.data.code}</p>
      <p className="supplier__container_code">{props.data.name}</p>
    </div>
  );
};

export default Supplier;
