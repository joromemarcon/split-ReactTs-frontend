import React, {
  ChangeEvent,
  createContext,
  ReactNode,
  SyntheticEvent,
  useContext,
  useState,
} from "react";

interface SearchBarContextType {
  onClick: (e: SyntheticEvent) => void;
  search: string | undefined;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    console.log(e.target.value);
  };

  const onClick = (e: SyntheticEvent) => {
    console.log(e);
  };

  return (
    <SearchBarContext.Provider value={{ onClick, search, handleChange }}>
      {children}
    </SearchBarContext.Provider>
  );
}
