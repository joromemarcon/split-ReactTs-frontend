import React, { useState } from "react";
import "../Item/Item.css";

interface ItemProps {
  ItemName: string;
  ItemPrice: number;
  PaidCustomerId: number;
}

const Item = ({ ItemName, ItemPrice, PaidCustomerId }: ItemProps) => {
  const [selected, setSelected] = useState(false);

  const handleCheckboxChange = () => {
    setSelected(!selected);
  };

  if (PaidCustomerId == -1) {
    return (
      <div className="item">
        <input
          type="checkbox"
          className="item-checkbox"
          checked={selected}
          onChange={handleCheckboxChange} // Handle toggle
        />
        <span className="item-name">{ItemName}</span>
        <span className="item-price">${ItemPrice.toFixed(2)}</span>
        <p className="item-paid-by"></p>
      </div>
    );
  } else {
    return (
      <div className="item">
        <span className="item-name">{ItemName}</span>
        <span className="item-price">${ItemPrice.toFixed(2)}</span>
        <p className="item-paid-by">Paid by customer #{PaidCustomerId}</p>
      </div>
    );
  }
};

export default Item;
