import React, { useState } from "react";
import Item from "../../Components/Item/Item";
import "../ReceiptPage/ReceiptDetailsPage.css";

const ReceiptDetailsPage = () => {
  const itemList = [
    {
      id: 0,
      ItemName: "Soda1",
      ItemPrice: "2.99",
      PaidCustomerId: -1,
    },
    {
      id: 1,
      ItemName: "Soda2",
      ItemPrice: "3.99",
      PaidCustomerId: 1,
    },
    {
      id: 2,
      ItemName: "Soda3",
      ItemPrice: "4.99",
      PaidCustomerId: 0,
    },
    {
      id: 3,
      ItemName: "Soda4",
      ItemPrice: "5.99",
      PaidCustomerId: -1,
    },
    {
      id: 4,
      ItemName: "Soda5",
      ItemPrice: "6.99",
      PaidCustomerId: -1,
    },
  ];
  const paidItemList = itemList.filter((item) => item.PaidCustomerId != -1);
  const unPaidItemList = itemList.filter((item) => item.PaidCustomerId == -1);

  return (
    <div className="Receipt-Home-Page">
      <div className="Items-Container">
        <h2>This is unpaid section</h2>
        {unPaidItemList.map((item) => (
          <Item
            key={item.id}
            ItemName={item.ItemName}
            ItemPrice={Number(item.ItemPrice)}
            PaidCustomerId={item.PaidCustomerId}
          ></Item>
        ))}

        <h2>This is Paid section</h2>
        {paidItemList.map((item) => (
          <Item
            key={item.id}
            ItemName={item.ItemName}
            ItemPrice={Number(item.ItemPrice)}
            PaidCustomerId={item.PaidCustomerId}
          ></Item>
        ))}
      </div>
    </div>
  );
};

export default ReceiptDetailsPage;
