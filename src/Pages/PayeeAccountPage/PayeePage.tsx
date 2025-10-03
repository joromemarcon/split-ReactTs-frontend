import React, { useState } from "react";
import Header from "../../Layouts/Header";
import SideBar from "../../Layouts/SideBar";
import { Outlet } from "react-router-dom";
import { useContent } from "../../Context/ContentContext";
import ReceiptListPage from "../ReceiptPage/ReceiptListPage";
import NewReceiptPage from "../ReceiptPage/NewReceiptPage";
import JoinReceiptPage from "../ReceiptPage/JoinReceiptPage";
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
        return (
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Home</h1>
              <p className="text-gray-600 text-lg">
                Manage your receipts and split expenses with ease.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="text-indigo-600 mb-4">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">View Receipts</h3>
                <p className="text-gray-600">Browse and manage all your receipts in one place.</p>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="text-green-600 mb-4">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Receipt</h3>
                <p className="text-gray-600">Add new receipts and split expenses with friends.</p>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="text-purple-600 mb-4">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Search Receipts</h3>
                <p className="text-gray-600">Find receipts by name, items, or amounts using the search bar.</p>
              </div>
            </div>
          </div>
        );
      case "receipts":
        return <ReceiptListPage />;
      case "new-receipt":
        return <NewReceiptPage />;
      case "join-receipt":
        return <JoinReceiptPage />;
    }
  };
  return (
    <div className="max-h-screen flex flex-col">
      <Header />
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
