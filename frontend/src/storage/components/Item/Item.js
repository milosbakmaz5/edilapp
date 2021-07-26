import React, { useContext, useState } from "react";
import { VscChevronUp, VscEdit, VscEllipsis, VscTrash } from "react-icons/vsc";
import { CSSTransition } from "react-transition-group";
import Button from "../../../shared/components/FormElements/Button/Button";
import Modal from "../../../shared/components/UIElements/Modal/Modal";
import RenderSmoothImage from "render-smooth-image-react";
import "render-smooth-image-react/build/style.css";

import "./Item.scss";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal/ErrorModal";

const Item = (props) => {
  const auth = useContext(AuthContext);
  const {
    productionName,
    financeName,
    suppliers,
    weight,
    measure,
    price,
    image,
  } = props.data;
  const [showMore, setShowMore] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const showMoreHandler = () => {
    setShowMore((prevState) => !prevState);
  };

  const deleteItemHandler = () => {
    setShowDeleteModal(true);
  };

  const closeModalHandler = () => {
    setShowDeleteModal(false);
  };

  const submitDeletingHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/items/${props.data.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onDelete(props.data.id);
    } catch (error) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        onCancel={closeModalHandler}
        onSubmit={submitDeletingHandler}
        header="Are you sure?"
        show={showDeleteModal}
        headerClass="modal__header"
        footerClass="add-supplier__footer"
        footer={
          <div className="add-supplier__buttons">
            <Button type="button" inverse onClick={closeModalHandler}>
              CANCEL
            </Button>
            <Button type="submit">
              {!isLoading && "DELETE"}
              {isLoading && "Deleting..."}
            </Button>
          </div>
        }
      >
        <p>Are you sure you want to delete this item?</p>
        <br />
        <p>
          Production name:{" "}
          <span style={{ fontWeight: "bold" }}>{productionName}</span>
        </p>
        <p>
          Finance name:{" "}
          <span style={{ fontWeight: "bold" }}>{financeName}</span>
        </p>
      </Modal>
      <div className="item__container">
        <div className="item__content">
          <label>Production name:</label>
          <p className="item__content_bold">{productionName}</p>
        </div>
        <div className="item__content">
          <label>Finance name:</label>
          <p className="item__content_bold">{financeName}</p>
        </div>
        <div className="item__content">
          <label>Suppliers:</label>
          {suppliers &&
            suppliers.map((supplier) => (
              <div className="item__supplier" key={supplier.id}>
                <span className="item__content_bold">{supplier.code}</span> -{" "}
                <span>{supplier.name}</span>
              </div>
            ))}
        </div>
        <CSSTransition
          in={showMore}
          mountOnEnter
          unmountOnExit
          timeout={300}
          classNames="item__details_animation"
        >
          <div className="item__details">
            <hr />
            <div className="item__details_image">
              <RenderSmoothImage
                src={`${process.env.REACT_APP_ASSET_URL}/${image}`}
                alt={productionName}
              />
              {/* <img
                src={`${process.env.REACT_APP_ASSET_URL}/${image}`}
                alt={productionName}
              /> */}
            </div>
            <div className="item__details_content">
              <div className="item__content">
                <label>Measure:</label>
                <p className="item__content_bold">{measure}</p>
              </div>
              <div className="item__content">
                <label>Weight (grams):</label>
                <p className="item__content_bold">{weight}</p>
              </div>
              <div className="item__content">
                <label>Price (din):</label>
                <p className="item__content_bold">{price}</p>
              </div>
            </div>
          </div>
        </CSSTransition>
        <div className="item__container_buttons">
          <Button type="button" transparent onClick={showMoreHandler}>
            {/* {!showMore && "See more"}
          {showMore && "View less"} */}
            {!showMore && <VscEllipsis />}
            {showMore && <VscChevronUp />}
          </Button>
          <Button to={`/storage/${props.data.id}`} transparent type="button">
            <VscEdit />
          </Button>
          <Button onClick={deleteItemHandler} transparent type="button">
            <VscTrash />
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Item;
