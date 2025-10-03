import React, { useState } from 'react';
import { Receipt as ReceiptType, ReceiptItem, claimItems, unclaimItems } from '../../Services/ReceiptService';
import { useAuth } from '../../Context/AuthContext';
import { toast } from 'react-toastify';

interface ReceiptProps {
  receipt: ReceiptType;
  onClick?: () => void;
  isExpanded?: boolean;
  onItemsClaimed?: () => void; // Callback to refresh receipt data
}

const Receipt: React.FC<ReceiptProps> = ({ receipt, onClick, isExpanded = false, onItemsClaimed }) => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedClaimedItems, setSelectedClaimedItems] = useState<number[]>([]);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isUnclaiming, setIsUnclaiming] = useState(false);
  const { token, user } = useAuth();

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const handleItemSelection = (itemId: number) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleClaimedItemSelection = (itemId: number) => {
    setSelectedClaimedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleClaimItems = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent collapse
    if (selectedItems.length === 0) {
      toast.warning('Please select items to claim');
      return;
    }

    if (!token) {
      toast.error('Authentication required');
      return;
    }

    try {
      setIsClaiming(true);
      const result = await claimItems(selectedItems, token);
      toast.success(result.message);
      setSelectedItems([]);
      onItemsClaimed?.(); // Refresh receipt data
    } catch (error) {
      toast.error('Failed to claim items');
    } finally {
      setIsClaiming(false);
    }
  };

  const handleUnclaimItems = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedClaimedItems.length === 0) {
      toast.warning('Please select items to unclaim');
      return;
    }

    if (!token) {
      toast.error('Authentication required');
      return;
    }

    try {
      setIsUnclaiming(true);
      const result = await unclaimItems(selectedClaimedItems, token);
      toast.success(result.message);
      setSelectedClaimedItems([]);
      onItemsClaimed?.();
    } catch (error) {
      toast.error('Failed to unclaim items');
    } finally {
      setIsUnclaiming(false);
    }
  };

  if (!isExpanded) {
    // Compact card view
    const borderColor = receipt.isOwner === true
      ? 'border-green-200 hover:border-green-300'
      : receipt.isOwner === false
      ? 'border-purple-200 hover:border-purple-300'
      : 'border-gray-200 hover:border-indigo-200';

    return (
      <div
        className={`border-2 ${borderColor} rounded-xl p-4 bg-white shadow-sm transition-all duration-300 ${
          onClick ? 'cursor-pointer hover:shadow-lg hover:scale-105' : ''
        }`}
        onClick={onClick}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-gray-900 truncate">{receipt.establishmentName}</h3>
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
            <p className="text-sm text-gray-500">{formatDate(receipt.transactionDateTime)}</p>
          </div>
          <div className="ml-4 text-right">
            <div className="text-lg font-bold text-green-600">{formatCurrency(receipt.transactionTotal)}</div>
            <div className="text-xs text-gray-400 font-mono">#{receipt.receiptCode}</div>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>{receipt.items?.length || 0} item{(receipt.items?.length || 0) !== 1 ? 's' : ''}</span>
          <span className="text-indigo-600 font-medium">Click to expand</span>
        </div>
      </div>
    );
  }

  // Expanded detailed view
  const expandedBorderColor = receipt.isOwner === true
    ? 'border-green-300'
    : receipt.isOwner === false
    ? 'border-purple-300'
    : 'border-indigo-200';

  return (
    <div
      className={`border-2 ${expandedBorderColor} rounded-xl p-6 bg-white shadow-lg transition-all duration-300`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-2xl font-bold text-gray-900">{receipt.establishmentName}</h3>
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
          <p className="text-sm text-gray-500">{formatDate(receipt.transactionDateTime)}</p>
          {receipt.transactionNumber && (
            <p className="text-xs text-gray-400 mt-1">Transaction: {receipt.transactionNumber}</p>
          )}
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400 font-mono mb-1">#{receipt.receiptCode}</div>
          <button
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            Collapse
          </button>
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
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors text-sm font-medium"
              >
                {isClaiming ? 'Claiming...' : `Claim ${selectedItems.length} Item${selectedItems.length > 1 ? 's' : ''}`}
              </button>
            )}
            {selectedClaimedItems.length > 0 && receipt.isOwner && (
              <button
                onClick={handleUnclaimItems}
                disabled={isUnclaiming}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors text-sm font-medium"
              >
                {isUnclaiming ? 'Unclaiming...' : `Unclaim ${selectedClaimedItems.length} Item${selectedClaimedItems.length > 1 ? 's' : ''}`}
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

              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 py-2 px-3 rounded-lg border-2 transition-colors ${
                    isUnpaid
                      ? 'bg-green-50 border-green-200 hover:border-green-300'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                  onClick={(e) => {
                    if (isUnpaid) {
                      e.stopPropagation();
                      handleItemSelection(item.id);
                    } else if (isOwner) {
                      e.stopPropagation();
                      handleClaimedItemSelection(item.id);
                    }
                  }}
                >
                  {/* Checkbox for unpaid items */}
                  {isUnpaid && (
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleItemSelection(item.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                    />
                  )}

                  {/* Checkbox for claimed items (owner only) */}
                  {isClaimed && isOwner && (
                    <input
                      type="checkbox"
                      checked={selectedClaimedItems.includes(item.id)}
                      onChange={() => handleClaimedItemSelection(item.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-5 h-5 text-red-600 rounded focus:ring-red-500 cursor-pointer"
                    />
                  )}

                  <div className="flex-1 flex justify-between items-center">
                    <span className="font-medium text-gray-700">{item.itemName}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900">{formatCurrency(item.itemPrice)}</span>

                      {/* Status badge */}
                      {isUnpaid ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          Available
                        </span>
                      ) : isOwner ? (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                          Claimed by {item.paidCustomerName || `User #${item.paidCustomerId}`}
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                          Claimed
                        </span>
                      )}
                    </div>
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
            <span>{formatCurrency(receipt.transactionTotal - (receipt.transactionTax || 0) - (receipt.transactionTip || 0))}</span>
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
            <span className="text-green-600">{formatCurrency(receipt.transactionTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
