/******
 *
 *  This page is responsible for rendering a list of receipts related to the logged in user
 *  There will be two sections:
 *      1) Receipt(s) that the user owns - need to receive payment from
 *      2) Receipt(s) that the user is a part of - need to pay someone for
 *
 ******/

import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { Receipt as ReceiptType } from "../../Services/ReceiptService";
import Receipt from "../../Components/Receipt/Receipt";
import { toast } from "react-toastify";
import { useSearchBarContext } from "../../Context/SearchBarContext";
import { useContent } from "../../Context/ContentContext";

const ReceiptListPage = () => {
  const [expandedReceiptId, setExpandedReceiptId] = useState<number | null>(null);
  const { isAuthenticated, user } = useAuth();
  const { search, filterReceipts, globalReceipts, isLoading } = useSearchBarContext();
  const { selectedReceiptId, setSelectedReceiptId } = useContent();

  // Use global receipts from SearchBarContext to avoid duplicate API calls
  const receipts = globalReceipts;
  const error = null; // Error handling is now in SearchBarContext

  // Filter receipts based on search term
  const filteredReceipts = useMemo(() => {
    return filterReceipts(receipts);
  }, [receipts, filterReceipts]);

  // Handle receipt selection from search results
  useEffect(() => {
    if (selectedReceiptId !== null) {
      setExpandedReceiptId(selectedReceiptId);
      // Clear the selected receipt after setting it to prevent persistent selection
      setSelectedReceiptId(null);
    }
  }, [selectedReceiptId, setSelectedReceiptId]);


  const handleReceiptClick = (receipt: ReceiptType) => {
    console.log('Receipt clicked:', receipt);
    // Toggle expanded state
    setExpandedReceiptId(expandedReceiptId === receipt.id ? null : receipt.id);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 text-center">
        <div className="text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
        <p className="text-gray-500">Please log in to view your receipts.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-500">Loading your receipts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Receipts</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (receipts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Receipts Found</h3>
        <p className="text-gray-500 mb-4">You don't have any receipts yet. Create your first receipt to get started!</p>
        <button
          onClick={() => toast.info('Create receipt functionality coming soon!')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Create First Receipt
        </button>
      </div>
    );
  }

  // No search results
  if (search && search.trim() !== "" && filteredReceipts.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Receipts</h1>
          <p className="text-gray-600 text-lg">
            Welcome back, {user?.userName}! You have {receipts.length} receipt{receipts.length !== 1 ? 's' : ''}.
          </p>
        </div>
        
        <div className="flex flex-col items-center justify-center min-h-64 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Search Results</h3>
          <p className="text-gray-500 mb-4">
            No receipts found matching "{search}". Try searching by establishment name, receipt code, item name, or total amount.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Receipts</h1>
        <p className="text-gray-600 text-lg">
          Welcome back, {user?.userName}! 
          {search && search.trim() !== "" ? (
            <>
              {" "}Found {filteredReceipts.length} of {receipts.length} receipt{receipts.length !== 1 ? 's' : ''} matching "{search}".
            </>
          ) : (
            <>
              {" "}You have {receipts.length} receipt{receipts.length !== 1 ? 's' : ''}.
            </>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReceipts.map((receipt) => (
          <div key={receipt.id} className={expandedReceiptId === receipt.id ? "md:col-span-2 lg:col-span-3" : ""}>
            <Receipt
              receipt={receipt}
              onClick={() => handleReceiptClick(receipt)}
              isExpanded={expandedReceiptId === receipt.id}
            />
          </div>
        ))}
      </div>

    </div>
  );
};

export default ReceiptListPage;
