import axios from "axios";
import { UserProfileToken } from "./Models/User";

interface APITESTINGRESPONSE {
  data: [];
}

export const apiTest = async (query: string) => {
  try {
    const data = await axios.get<APITESTINGRESPONSE>(
      "http://localhost:5105/Receipt", // Replace with your API endpoint
      {
        headers: {
          Authorization: ` Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Impvcm9tZXRlc3RAZ21haWwuY29tIiwiZ2l2ZW5fbmFtZSI6Impvcm9tZXRlc3QiLCJuYmYiOjE3NDg3NTg2MDksImV4cCI6MTc0OTM2MzQwOSwiaWF0IjoxNzQ4NzU4NjA5LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUxMDUiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUxMDUifQ.sIfmSEg8gB7NQpwpzP6i_KqDaC4i2T40F6fQgJUgr_kijWCXkH-krQXyH7kgXFlJG-3sH8AxbQcOn_52hJ780w`, // Replace with your token
          "Content-Type": "application/json",
        },
        withCredentials: true, // Necessary if cookies or credentials are required
      }
    );
    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      return error.message;
    } else {
      console.log("unexpected error: ", error);
      return "An unexpected error has occurred.";
    }
  }
};

const api = "http://localhost:5105";

export const loginAPI = async (username: string, password: string) => {
  try {
    const data = await axios.post<UserProfileToken>(api + "account/login", {
      username: username,
      password: password,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
