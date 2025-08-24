import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler";
import { UserProfileToken } from "../Types/Auth";

const api = "http://localhost:5105/SplitUser/";

export const loginAPI = async (email: string, password: string) => {
  try {
    const data = await axios.post<UserProfileToken>(api + "login", {
      Email: email,
      Password: password,
    });
    return data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const registerAPI = async (
  email: string,
  username: string,
  password: string,
  fullName: string
) => {
  try {
    console.log('RegisterAPI: Sending registration request:', { Email: email, Username: username, FullName: fullName });
    const data = await axios.post<UserProfileToken>(api + "register", {
      Email: email,
      Username: username,
      Password: password,
      FullName: fullName,
    });
    console.log('RegisterAPI: Registration response:', data?.data);
    return data;
  } catch (error) {
    console.error('RegisterAPI: Registration failed:', error);
    handleError(error);
    throw error;
  }
};
