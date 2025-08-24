/**************************
 *
 *  useContext to centralize setting content desired in Payee and Payor page
 *  This is triggered when user selects what content to render from the side bar
 *
 */

import React, { createContext, ReactNode, useContext, useState } from "react";

interface ContentContextType {
  currentContent: string;
  setCurrentContent: (content: string) => void;
  selectedReceiptId: number | null;
  setSelectedReceiptId: (receiptId: number | null) => void;
}

const ContentContext = createContext<ContentContextType | null>(null);

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) throw Error("Cannot use outside of ContentContext");

  return context;
}

interface ContentProviderProps {
  children: ReactNode;
}

export function ContentProvider({ children }: ContentProviderProps) {
  const [currentContent, setCurrentContent] = useState<string>("home");
  const [selectedReceiptId, setSelectedReceiptId] = useState<number | null>(null);

  return (
    <ContentContext.Provider value={{ 
      currentContent, 
      setCurrentContent, 
      selectedReceiptId, 
      setSelectedReceiptId 
    }}>
      {children}
    </ContentContext.Provider>
  );
}
