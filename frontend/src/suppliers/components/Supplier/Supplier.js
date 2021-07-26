import React from "react";

import "./Supplier.scss";
import { VscAdd } from "react-icons/vsc";

const Supplier = (props) => {
  return (
    <div
      className={`supplier__container ${props.pick ? "supplier__pick" : ""} ${
        props.picked ? "supplier__picked" : ""
      }`}
    >
      {props.pick && (
        <button
          type="button"
          onClick={() => props.onSelect(props.data.id)}
          className={`supplier__pick_button ${
            props.picked ? "supplier__picked_button" : ""
          }`}
        >
          <span>{props.picked && <VscAdd />}</span>
        </button>
      )}
      <p className="supplier__container_code">{props.data.code}</p>
      <p className="supplier__container_code">{props.data.name}</p>
    </div>
  );
};

export default Supplier;
