import { axiosInstance } from "@/shared/lib/api-client";
import type { User } from "@/shared/stores/auth-store";
import type { components } from "@/shared/types/api-generated";

export const uploadAvatar = async (file: File): Promise<User> => {
  const formData = new FormData();

  formData.append("avatar", file);

  // No Content-Type header — axios detects FormData and sets it with the correct boundary automatically.
  // Setting it manually strips the boundary and breaks multipart parsing on the server.
  const { data } = await axiosInstance.patch<components["schemas"]["UserResponse"]>(
    "/users/me/avatar",
    formData,
  );

  return data.data as User;
};

export const changePassword = async (input: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> => {
  await axiosInstance.patch("/users/me/password", input);
};

export const updateProfile = async (
  id: string,
  input: components["schemas"]["UpdateUserInput"],
): Promise<User> => {
  const { data } = await axiosInstance.patch<components["schemas"]["UserResponse"]>(
    `/users/${id}`,
    input,
  );

  return data.data as User;
};
