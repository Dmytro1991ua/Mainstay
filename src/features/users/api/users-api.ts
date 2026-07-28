import { axiosInstance } from "@/shared/lib/api-client";
import type { components } from "@/shared/types/api-generated";

export type User = components["schemas"]["User"];
export type UserRole = User["roles"][number];
export type PendingInvite = components["schemas"]["PendingInvite"];

export type UsersListParams = {
  page?: number;
  limit?: number;
  role?: UserRole;
  sortBy?: "createdAt" | "userName" | "email";
  sortOrder?: "asc" | "desc";
};

export const getUsers = async (
  params: UsersListParams = {},
): Promise<components["schemas"]["UsersListResponse"]> => {
  const { data } = await axiosInstance.get<components["schemas"]["UsersListResponse"]>("/users", {
    params,
  });
  return data;
};

export const updateUserRoles = async (id: string, roles: UserRole[]): Promise<User> => {
  const { data } = await axiosInstance.patch<components["schemas"]["UserResponse"]>(
    `/users/${id}/roles`,
    { roles },
  );
  return data.data;
};

export const sendInvite = async (
  input: components["schemas"]["InviteUserInput"],
): Promise<components["schemas"]["InviteResponse"]["data"]> => {
  const { data } = await axiosInstance.post<components["schemas"]["InviteResponse"]>(
    "/users/invite",
    input,
  );
  return data.data;
};

export const getPendingInvites = async (): Promise<PendingInvite[]> => {
  const { data } =
    await axiosInstance.get<components["schemas"]["PendingInvitesResponse"]>(
      "/users/pending-invites",
    );

  return data.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/users/${id}`);
};

export const cancelInvite = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/users/invites/${id}`);
};

export const updateUserStatus = async (
  id: string,
  status: "ACTIVE" | "INACTIVE",
): Promise<User> => {
  const { data } = await axiosInstance.patch<components["schemas"]["UserResponse"]>(
    `/users/${id}/status`,
    { status },
  );

  return data.data;
};
