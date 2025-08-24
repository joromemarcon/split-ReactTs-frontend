import React from 'react';
import { Receipt as ReceiptType, ReceiptItem } from '../../Services/ReceiptService';

interface ReceiptProps {
  receipt: ReceiptType;
  onClick?: () => void;
  isExpanded?: boolean;
}

const Receipt: React.FC<ReceiptProps> = ({ receipt, onClick, isExpanded = false }) => {
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

  if (!isExpanded) {
    // Compact card view
    return (
      <div 
        className={`border border-gray-200 rounded-xl p-4 bg-white shadow-sm transition-all duration-300 ${
          onClick ? 'cursor-pointer hover:shadow-lg hover:scale-105 hover:border-indigo-200' : ''
        }`}
        onClick={onClick}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate">{receipt.establishmentName}</h3>
            <p className="text-sm text-gray-500 mt-1">{formatDate(receipt.transactionDateTime)}</p>
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
  return (
    <div 
      className="border border-indigo-200 rounded-xl p-6 bg-white shadow-lg transition-all duration-300"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{receipt.establishmentName}</h3>
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
        <h4 className="text-lg font-semibold text-gray-800 mb-3">
          Items ({receipt.items?.length || 0})
        </h4>
        
        {receipt.items && receipt.items.length > 0 ? (
          <div className="space-y-2">
            {receipt.items.map((item: ReceiptItem) => (
              <div key={item.id} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">{item.itemName}</span>
                <span className="font-bold text-gray-900">{formatCurrency(item.itemPrice)}</span>
              </div>
            ))}
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
