import React from "react";
//import "./App.css"; // Import CSS for global or app-specific styles
import PayeePage from "./Pages/PayeeAccountPage/PayeePage";
import { SearchBarProvider } from "./Context/SearchBarContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReceiptDetailsPage from "./Pages/ReceiptPage/ReceiptDetailsPage";
import LoginPage from "./Pages/Auth/LoginPage";
import RegisterPage from "./Pages/Auth/RegisterPage";
import ForgotPasswordPage from "./Pages/Auth/ForgotPasswordPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import { ContentProvider } from "./Context/ContentContext";
import { AuthProvider } from "./Context/AuthContext";
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
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <ContentProvider>
          <PayeePage />
        </ContentProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/payee",
    element: (
      <ProtectedRoute>
        <ContentProvider>
          <PayeePage />
        </ContentProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/receipt",
    element: (
      <ProtectedRoute>
        <ReceiptDetailsPage />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <AuthProvider>
      <SearchBarProvider>
        <div>
          <RouterProvider router={router}></RouterProvider>
          <ToastContainer />
        </div>
      </SearchBarProvider>
    </AuthProvider>
  );
}

export default App;
