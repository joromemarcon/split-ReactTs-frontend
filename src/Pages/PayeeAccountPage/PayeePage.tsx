import React from "react";
import Header from "../../Layouts/Header";
import SideBar from "../../Layouts/SideBar";

const PayeePage = () => {
  return (
    <div className="max-h-screen flex flex-col">
      <Header isLoggedIn={true}></Header>
      <div className="grid grid-cols-[auto,1fr] flex-grow-1 overflow-auto">
        <SideBar />
        <div className="overflow-x-hidden px-8 pb-4">
          <div className="sticky top-0 bg-white z-10 pb-4">content</div>
        </div>
      </div>
    </div>
  );
};

export default PayeePage;
