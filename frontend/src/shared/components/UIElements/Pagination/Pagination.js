import React, { useState, useEffect } from "react";

import "./Pagination.scss";
import { VscChevronRight, VscChevronLeft } from "react-icons/vsc";

const Pagination = ({
  data,
  RenderComponent,
  pageLimit,
  dataLimit,
  pick,
  onSelectSupplier,
  deleteItemHandler,
}) => {
  const [pages] = useState(Math.floor(data.length / dataLimit) + 1);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    window.scrollTo({ behavior: "smooth", top: "0px" });
  }, [currentPage]);

  const goToNextPage = () => {
    setCurrentPage((page) => page + 1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => page - 1);
  };

  const changePage = (event) => {
    const pageNumber = Number(event.target.textContent);
    setCurrentPage(pageNumber);
  };

  const getPaginatedData = () => {
    const startIndex = currentPage * dataLimit - dataLimit;
    const endIndex = startIndex + dataLimit;
    return data.slice(startIndex, endIndex);
  };

  const getPaginationGroup = () => {
    let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
    return new Array(pageLimit)
      .fill()
      .map((_, idx) => (start + idx + 1 > pages ? undefined : start + idx + 1));
  };

  const selectSupplierHandler = (supplierId) => {
    onSelectSupplier(supplierId);
  };

  return (
    <div>
      <div>
        {getPaginatedData().map((d, idx) => (
          <RenderComponent
            key={idx}
            data={d}
            pick={pick}
            picked={d.isSelected}
            onSelect={selectSupplierHandler}
            onDelete={deleteItemHandler}
          />
        ))}
      </div>

      <div className="pagination">
        <button
          type="button"
          onClick={goToPreviousPage}
          className={`prev ${currentPage === 1 ? "disabled" : ""}`}
        >
          <VscChevronLeft />
        </button>

        {getPaginationGroup().map((item, index) => (
          <button
            type="button"
            key={index}
            onClick={changePage}
            className={`paginationItem ${
              currentPage === item ? "active" : null
            } ${item === undefined ? "undefined" : null}`}
          >
            <span>{item}</span>
          </button>
        ))}

        <button
          type="button"
          onClick={goToNextPage}
          className={`next ${currentPage === pages ? "disabled" : ""}`}
        >
          <VscChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
