import axios from "axios";
import { authService } from "./authService";

const BASE_URL = "http://localhost:8080"; // ajuste para sua URL de API

export interface UpdateUserData {
  name: string;
  email: string;
  phone: string;
}

export const userService = {
  async updateUser(data: UpdateUserData) {
    const token = authService.getToken();
    if (!token) throw new Error("No token found");
    const user = localStorage.getItem("user");
    const response = await axios.put(
      `${BASE_URL}/user/${JSON.parse(user || "{}").id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },
};
