import React, {
  ChangeEvent,
  createContext,
  ReactNode,
  SyntheticEvent,
  useContext,
  useState,
  useEffect,
} from "react";
import { Receipt, getUserReceipts } from "../Services/ReceiptService";
import { useAuth } from "./AuthContext";

interface SearchBarContextType {
  onClick: (e: SyntheticEvent) => void;
  search: string | undefined;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  filterReceipts: (receipts: Receipt[]) => Receipt[];
  clearSearch: () => void;
  globalReceipts: Receipt[];
  getSearchResults: () => Receipt[];
  isLoading: boolean;
  refreshReceipts: () => Promise<void>;
}
const SearchBarContext = createContext<SearchBarContextType | null>(null);

export function useSearchBarContext() {
  const value = useContext(SearchBarContext);
  if (value == null) throw Error("cannot use outside of SearchBarProvider");

  return value;
}

/*
 *
 * PROVIDER CODE
 *
 */

interface SearchBarProviderProps {
  children: ReactNode;
}

export function SearchBarProvider({ children }: SearchBarProviderProps) {
  const [search, setSearch] = useState("");
  const [globalReceipts, setGlobalReceipts] = useState<Receipt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token, isAuthenticated } = useAuth();

  // Load all receipts for global search
  useEffect(() => {
    const loadReceipts = async () => {
      if (!isAuthenticated || !token) {
        setGlobalReceipts([]);
        return;
      }

      try {
        setIsLoading(true);
        const receipts = await getUserReceipts(token);
        setGlobalReceipts(receipts || []);
      } catch (error) {
        console.error('SearchBarContext: Error loading receipts:', error);
        setGlobalReceipts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadReceipts();
  }, [isAuthenticated, token]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onClick = (e: SyntheticEvent) => {
    e.preventDefault();
  };

  const clearSearch = () => {
    setSearch("");
  };

  const filterReceipts = (receipts: Receipt[]): Receipt[] => {
    if (!search || search.trim() === "") {
      return receipts;
    }

    const searchTerm = search.toLowerCase().trim();

    return receipts.filter((receipt) => {
      // Search in establishment name
      if (receipt.establishmentName.toLowerCase().includes(searchTerm)) {
        return true;
      }

      // Search in receipt code
      if (receipt.receiptCode.toLowerCase().includes(searchTerm)) {
        return true;
      }

      // Search in transaction number
      if (receipt.transactionNumber && receipt.transactionNumber.toLowerCase().includes(searchTerm)) {
        return true;
      }

      // Search in transaction total (as string)
      if (receipt.transactionTotal.toString().includes(searchTerm)) {
        return true;
      }

      // Search in item names
      if (receipt.items && receipt.items.length > 0) {
        const hasMatchingItem = receipt.items.some((item) =>
          item.itemName.toLowerCase().includes(searchTerm)
        );
        if (hasMatchingItem) {
          return true;
        }
      }

      return false;
    });
  };

  // Global search results for all tabs
  const getSearchResults = (): Receipt[] => {
    return filterReceipts(globalReceipts);
  };

  // Refresh receipts manually (e.g., after claiming items)
  const refreshReceipts = async () => {
    if (!isAuthenticated || !token) {
      return;
    }

    try {
      setIsLoading(true);
      const receipts = await getUserReceipts(token);
      setGlobalReceipts(receipts || []);
    } catch (error) {
      console.error('SearchBarContext: Error refreshing receipts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SearchBarContext.Provider
      value={{
        onClick,
        search,
        handleChange,
        filterReceipts,
        clearSearch,
        globalReceipts,
        getSearchResults,
        isLoading,
        refreshReceipts
      }}
    >
      {children}
    </SearchBarContext.Provider>
  );
}
