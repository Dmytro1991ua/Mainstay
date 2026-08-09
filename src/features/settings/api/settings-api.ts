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

export const signOutAllDevices = async (): Promise<void> => {
  await axiosInstance.delete("/users/me/sessions");
};

export const deleteAccount = async (): Promise<void> => {
  await axiosInstance.delete("/users/me");
};

export type NotificationPreferences = {
  LOW_STOCK: boolean;
  OUT_OF_STOCK: boolean;
  TASK_OVERDUE: boolean;
};

export const getNotificationPreferences = async (): Promise<NotificationPreferences> => {
  const { data } = await axiosInstance.get<{ success: true; data: NotificationPreferences }>(
    "/users/me/notification-preferences",
  );
  return data.data;
};

export const updateNotificationPreferences = async (
  preferences: Partial<NotificationPreferences>,
): Promise<NotificationPreferences> => {
  const { data } = await axiosInstance.patch<{ success: true; data: NotificationPreferences }>(
    "/users/me/notification-preferences",
    preferences,
  );
  return data.data;
};
