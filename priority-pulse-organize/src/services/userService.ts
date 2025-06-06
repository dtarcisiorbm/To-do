import api from "./api";

export interface UpdateUserData {
  username: string;
  email: string;
  phone?: string;
}

export const userService = {
  async updateUser(data: UpdateUserData) {
    const user = localStorage.getItem("user");
    const userData = JSON.parse(user);
    const token = localStorage.getItem("access_token");
    const response = await api.put(`/user/${userData.id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
