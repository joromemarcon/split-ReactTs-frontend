import React from "react";
//import "./App.css"; // Import CSS for global or app-specific styles
import PayeePage from "./Pages/PayeeAccountPage/PayeePage";
import { SearchBarProvider } from "./Context/SearchBarContext";

/****************************
        RECEIPT MODEL
*****************************
{
    "id": 1,
    "receiptCode": "123receipt123",
    "transactionNumber": "123",
    "establishmentName": "Subway",
    "transactionDateTime": "2/3/2025",
    "items": [
      {
        "id": 1,
        "itemName": "Cookies",
        "itemPrice": 2.99,
        "receiptId": 1
      },
      {
        "id": 2,
        "itemName": "Sandwhich",
        "itemPrice": 9.99,
        "receiptId": 1
      }
    ]
  }

*/

function App() {
  return (
    <SearchBarProvider>
      <div>
        <PayeePage />
      </div>
    </SearchBarProvider>
  );
}

export default App;
