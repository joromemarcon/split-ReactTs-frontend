import React, { useState } from "react";
import {
  Receipt as ReceiptType,
  ReceiptItem,
  claimItems,
  unclaimItems,
  updateReceipt,
  UpdateReceiptRequest,
  updateItem,
  deleteItem,
  UpdateItemRequest,
} from "../../Services/ReceiptService";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";

interface ReceiptProps {
  receipt: ReceiptType;
  onClick?: () => void;
  isExpanded?: boolean;
  onItemsClaimed?: () => void; // Callback to refresh receipt data
}

const Receipt: React.FC<ReceiptProps> = ({
  receipt,
  onClick,
  isExpanded = false,
  onItemsClaimed,
}) => {
  //State Variables
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedClaimedItems, setSelectedClaimedItems] = useState<number[]>(
    []
  );
  const [isClaiming, setIsClaiming] = useState(false);
  const [isUnclaiming, setIsUnclaiming] = useState(false);

  //Receipts
  const [isEditingReceipt, setIsEditingReceipt] = useState(false);
  const [editReceiptData, setEditReceiptData] =
    useState<UpdateReceiptRequest | null>(null);
  const [isSavingReceipt, setIsSavingReceipt] = useState(false);

  //Items
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editItemData, setEditItemData] = useState<{
    itemName: string;
    itemPrice: number;
  } | null>(null);
  const [isSavingItem, setIsSavingItem] = useState(false);

  const { token, user } = useAuth();

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const handleItemSelection = (itemId: number) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleClaimedItemSelection = (itemId: number) => {
    setSelectedClaimedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleClaimItems = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent collapse
    if (selectedItems.length === 0) {
      toast.warning("Please select items to claim");
      return;
    }

    if (!token) {
      toast.error("Authentication required");
      return;
    }

    try {
      setIsClaiming(true);
      const result = await claimItems(selectedItems, token);
      toast.success(result.message);
      setSelectedItems([]);
      onItemsClaimed?.(); // Refresh receipt data
    } catch (error) {
      toast.error("Failed to claim items");
    } finally {
      setIsClaiming(false);
    }
  };

  const handleUnclaimItems = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedClaimedItems.length === 0) {
      toast.warning("Please select items to unclaim");
      return;
    }

    if (!token) {
      toast.error("Authentication required");
      return;
    }

    try {
      setIsUnclaiming(true);
      const result = await unclaimItems(selectedClaimedItems, token);
      toast.success(result.message);
      setSelectedClaimedItems([]);
      onItemsClaimed?.();
    } catch (error) {
      toast.error("Failed to unclaim items");
    } finally {
      setIsUnclaiming(false);
    }
  };

  /* 
      Receipt Handlers
    */
  const handleEditReceipt = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditReceiptData({
      receiptCode: receipt.receiptCode,
      transactionNumber: receipt.transactionNumber,
      establishmentName: receipt.establishmentName,
      transactionDatetime: receipt.transactionDateTime,
      transactionTotal: receipt.transactionTotal,
      transactionTax: receipt.transactionTax,
      transactionTip: receipt.transactionTip,
    });
    setIsEditingReceipt(true);
  };

  const handleSaveReceipt = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editReceiptData || !token) return;

    try {
      setIsSavingReceipt(true);
      await updateReceipt(receipt.id, editReceiptData, token);
      toast.success("Receipt updated successfully");
      setIsEditingReceipt(false);
      setEditReceiptData(null);
      onItemsClaimed?.(); //refresh data
    } catch (error) {
      toast.error("Failed to update receipt");
    } finally {
      setIsSavingReceipt(false);
    }
  };

  const handleCancelEditReceipt = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingReceipt(false);
    setEditReceiptData(null);
  };

  /* 
      Item edit handlers
    */
  const handleEditItem = (item: ReceiptItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItemId(item.id);
    setEditItemData({
      itemName: item.itemName,
      itemPrice: item.itemPrice,
    });
  };

  const handleSaveItem = async (itemId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editItemData || !token) return;

    try {
      setIsSavingItem(true);
      const updateData: UpdateItemRequest = {
        itemName: editItemData.itemName,
        itemPrice: editItemData.itemPrice,
        receiptId: receipt.id,
        paidCustomerId:
          receipt.items?.find((i) => i.id === itemId)?.paidCustomerId || -1,
      };
      await updateItem(itemId, updateData, token);
      toast.success("Item update Successfully");
      setEditingItemId(null);
      setEditItemData(null);
      onItemsClaimed?.();
    } catch (error) {
      toast.error("Failed to update item");
    } finally {
      setIsSavingItem(false);
    }
  };

  const handleCancelEditItem = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItemId(null);
    setEditItemData(null);
  };

  const handleDeleteItem = async (itemId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token || !window.confirm("Are you sure you want to delete this item?"))
      return;

    try {
      await deleteItem(itemId, token);
      toast.success("Item deleted successfully");
      onItemsClaimed?.();
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  if (!isExpanded) {
    // Compact card view
    const borderColor =
      receipt.isOwner === true
        ? "border-green-200 hover:border-green-300"
        : receipt.isOwner === false
        ? "border-purple-200 hover:border-purple-300"
        : "border-gray-200 hover:border-indigo-200";

    return (
      <div
        className={`border-2 ${borderColor} rounded-xl p-4 bg-white shadow-sm transition-all duration-300 ${
          onClick ? "cursor-pointer hover:shadow-lg hover:scale-105" : ""
        }`}
        onClick={onClick}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-gray-900 truncate">
                {receipt.establishmentName}
              </h3>
              {receipt.isOwner === true && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  Owner
                </span>
              )}
              {receipt.isOwner === false && (
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                  Member
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {formatDate(receipt.transactionDateTime)}
            </p>
          </div>
          <div className="ml-4 text-right">
            <div className="text-lg font-bold text-green-600">
              {formatCurrency(receipt.transactionTotal)}
            </div>
            <div className="text-xs text-gray-400 font-mono">
              #{receipt.receiptCode}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>
            {receipt.items?.length || 0} item
            {(receipt.items?.length || 0) !== 1 ? "s" : ""}
          </span>
          <span className="text-indigo-600 font-medium">Click to expand</span>
        </div>
      </div>
    );
  }

  // Expanded detailed view
  const expandedBorderColor =
    receipt.isOwner === true
      ? "border-green-300"
      : receipt.isOwner === false
      ? "border-purple-300"
      : "border-indigo-200";

  return (
    <div
      className={`border-2 ${expandedBorderColor} rounded-xl p-6 bg-white shadow-lg transition-all duration-300`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
        <div className="flex-1">
          {isEditingReceipt && editReceiptData ? (
            // Edit mode
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Establishment Name
                </label>
                <input
                  type="text"
                  value={editReceiptData.establishmentName}
                  onChange={(e) =>
                    setEditReceiptData({
                      ...editReceiptData,
                      establishmentName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Transaction Date
                  </label>
                  <input
                    type="datetime-local"
                    value={editReceiptData.transactionDatetime}
                    onChange={(e) =>
                      setEditReceiptData({
                        ...editReceiptData,
                        transactionDatetime: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Transaction Number
                  </label>
                  <input
                    type="text"
                    value={editReceiptData.transactionNumber}
                    onChange={(e) =>
                      setEditReceiptData({
                        ...editReceiptData,
                        transactionNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Tax
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editReceiptData.transactionTax}
                    onChange={(e) =>
                      setEditReceiptData({
                        ...editReceiptData,
                        transactionTax: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Tip
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editReceiptData.transactionTip}
                    onChange={(e) =>
                      setEditReceiptData({
                        ...editReceiptData,
                        transactionTip: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Total
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editReceiptData.transactionTotal}
                    onChange={(e) =>
                      setEditReceiptData({
                        ...editReceiptData,
                        transactionTotal: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            </div>
          ) : (
            // Display mode
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-2xl font-bold text-gray-900">
                  {receipt.establishmentName}
                </h3>
                {receipt.isOwner === true && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                    Owner
                  </span>
                )}
                {receipt.isOwner === false && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
                    Member
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {formatDate(receipt.transactionDateTime)}
              </p>
              {receipt.transactionNumber && (
                <p className="text-xs text-gray-400 mt-1">
                  Transaction: {receipt.transactionNumber}
                </p>
              )}
            </div>
          )}
        </div>
        <div className="text-right ml-4">
          <div className="text-xs text-gray-400 font-mono mb-2">
            #{receipt.receiptCode}
          </div>
          {isEditingReceipt ? (
            <div className="flex gap-2">
              <button
                onClick={handleSaveReceipt}
                disabled={isSavingReceipt}
                className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                {isSavingReceipt ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancelEditReceipt}
                disabled={isSavingReceipt}
                className="px-3 py-1 bg-gray-600 text-white text-xs rounded-lg hover:bg-gray-700 disabled:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {receipt.isOwner && (
                <button
                  onClick={handleEditReceipt}
                  className="block text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Edit Receipt
                </button>
              )}
              <button
                className="block text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick?.();
                }}
              >
                Collapse
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Items Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-lg font-semibold text-gray-800">
            Items ({receipt.items?.length || 0})
          </h4>
          <div className="flex gap-2">
            {selectedItems.length > 0 && (
              <button
                onClick={handleClaimItems}
                disabled={isClaiming}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors text-sm        
  font-medium"
              >
                {isClaiming
                  ? "Claiming..."
                  : `Claim ${selectedItems.length} Item${
                      selectedItems.length > 1 ? "s" : ""
                    }`}
              </button>
            )}
            {selectedClaimedItems.length > 0 && receipt.isOwner && (
              <button
                onClick={handleUnclaimItems}
                disabled={isUnclaiming}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors text-sm
  font-medium"
              >
                {isUnclaiming
                  ? "Unclaiming..."
                  : `Unclaim ${selectedClaimedItems.length} Item${
                      selectedClaimedItems.length > 1 ? "s" : ""
                    }`}
              </button>
            )}
          </div>
        </div>

        {receipt.items && receipt.items.length > 0 ? (
          <div className="space-y-2">
            {receipt.items.map((item: ReceiptItem) => {
              const isUnpaid = item.paidCustomerId === -1;
              const isOwner = receipt.isOwner === true;
              const isClaimed = !isUnpaid;
              const isEditingThisItem = editingItemId === item.id;

              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 py-2 px-3 rounded-lg border-2 transition-colors ${
                    isUnpaid
                      ? "bg-green-50 border-green-200 hover:border-green-300"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  {/* Checkbox for unpaid items */}
                  {isUnpaid && !isEditingThisItem && (
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleItemSelection(item.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                    />
                  )}

                  {/* Checkbox for claimed items (owner only) */}
                  {isClaimed && isOwner && !isEditingThisItem && (
                    <input
                      type="checkbox"
                      checked={selectedClaimedItems.includes(item.id)}
                      onChange={() => handleClaimedItemSelection(item.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-5 h-5 text-red-600 rounded focus:ring-red-500 cursor-pointer"
                    />
                  )}

                  <div className="flex-1 flex justify-between items-center">
                    {isEditingThisItem && editItemData ? (
                      // Edit mode
                      <div className="flex gap-2 flex-1">
                        <input
                          type="text"
                          value={editItemData.itemName}
                          onChange={(e) =>
                            setEditItemData({
                              ...editItemData,
                              itemName: e.target.value,
                            })
                          }
                          className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <input
                          type="number"
                          step="0.01"
                          value={editItemData.itemPrice}
                          onChange={(e) =>
                            setEditItemData({
                              ...editItemData,
                              itemPrice: parseFloat(e.target.value),
                            })
                          }
                          className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          onClick={(e) => handleSaveItem(item.id, e)}
                          disabled={isSavingItem}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:bg-gray-400"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEditItem}
                          disabled={isSavingItem}
                          className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 disabled:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      // Display mode
                      <>
                        <span className="font-medium text-gray-700">
                          {item.itemName}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-900">
                            {formatCurrency(item.itemPrice)}
                          </span>

                          {/* Status badge */}
                          {isUnpaid ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                              Available
                            </span>
                          ) : isOwner ? (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                              Claimed by{" "}
                              {item.paidCustomerName ||
                                `User #${item.paidCustomerId}`}
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                              Claimed
                            </span>
                          )}

                          {/* Edit/Delete buttons for owner */}
                          {isOwner && (
                            <div className="flex gap-1">
                              <button
                                onClick={(e) => handleEditItem(item, e)}
                                className="p-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded"
                                title="Edit item"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828
  15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={(e) => handleDeleteItem(item.id, e)}
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                title="Delete item"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1    
   1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 italic">No items found</p>
        )}
      </div>

      {/* Financial Summary */}
      <div className="border-t border-gray-100 pt-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-gray-600">
            <span>Subtotal:</span>
            <span>
              {formatCurrency(
                receipt.transactionTotal -
                  (receipt.transactionTax || 0) -
                  (receipt.transactionTip || 0)
              )}
            </span>
          </div>

          {receipt.transactionTax > 0 && (
            <div className="flex justify-between items-center text-gray-600">
              <span>Tax:</span>
              <span>{formatCurrency(receipt.transactionTax)}</span>
            </div>
          )}

          {receipt.transactionTip > 0 && (
            <div className="flex justify-between items-center text-gray-600">
              <span>Tip:</span>
              <span>{formatCurrency(receipt.transactionTip)}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-xl font-bold text-gray-900 border-t border-gray-200 pt-3 mt-3">
            <span>Total:</span>
            <span className="text-green-600">
              {formatCurrency(receipt.transactionTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
