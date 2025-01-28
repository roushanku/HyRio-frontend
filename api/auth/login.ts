import axios from "axios";

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      "http://10.50.40.217:8000/api/auth/login",
      {
        email,
        password,
      }
    );
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};
