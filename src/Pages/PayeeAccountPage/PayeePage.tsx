import React, { useState } from "react";
import Header from "../../Layouts/Header";
import SideBar from "../../Layouts/SideBar";
import { Outlet } from "react-router-dom";
import { useContent } from "../../Context/ContentContext";
import ReceiptListPage from "../ReceiptPage/ReceiptListPage";
import { apiTest } from "../../apiTest";

const PayeePage = () => {
  (async () => {
    const response = await apiTest("");
    console.log("API Response:", response);
  })();

  const { currentContent } = useContent();

  const renderContent = () => {
    switch (currentContent) {
      case "home":
        return <div>Home</div>;
      case "receipts":
        return <ReceiptListPage />;
      case "new-receipt":
        return <div>New Receipt</div>;
    }
  };
  return (
    <div className="max-h-screen flex flex-col">
      <Header isLoggedIn={true}></Header>
      <div className="grid grid-cols-[auto,1fr] flex-grow-1 overflow-auto">
        <SideBar />
        <div className="overflow-x-hidden px-8 pb-4">
          <div className="sticky top-0 bg-white">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default PayeePage;
