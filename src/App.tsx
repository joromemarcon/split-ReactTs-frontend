import React from "react";
//import "./App.css"; // Import CSS for global or app-specific styles
import PayeePage from "./Pages/PayeeAccountPage/PayeePage";
import { SearchBarProvider } from "./Context/SearchBarContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PayorPage from "./Pages/PayorAccountPage/PayorPage";
import ReceiptDetailsPage from "./Pages/ReceiptPage/ReceiptDetailsPage";
import { ContentProvider } from "./Context/ContentContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ContentProvider>
        <PayeePage />
      </ContentProvider>
    ),
  },
  {
    path: "/payee",
    element: (
      <ContentProvider>
        <PayeePage />
      </ContentProvider>
    ),
  },
  {
    path: "/receipt",
    element: <ReceiptDetailsPage />,
  },
]);

function App() {
  return (
    <SearchBarProvider>
      <div>
        <RouterProvider router={router}></RouterProvider>
        <ToastContainer />
      </div>
    </SearchBarProvider>
  );
}

export default App;
