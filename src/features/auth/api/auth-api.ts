import { axiosInstance } from "@/shared/lib/api-client";
import type { components } from "@/shared/types/api-generated";

export type RegisterInput = components["schemas"]["RegisterInput"];
export type LoginInput = components["schemas"]["LoginInput"];

export const register = async (input: RegisterInput) => {
  const { data } = await axiosInstance.post<components["schemas"]["RegisterResponse"]>(
    "/auth/register",
    input,
  );

  return data.data;
};

export const login = async (input: LoginInput) => {
  const { data } = await axiosInstance.post<components["schemas"]["LoginResponse"]>(
    "/auth/login",
    input,
  );

  return data.data;
};

export const logout = async () => {
  await axiosInstance.post("/auth/logout");
};

export const refresh = async () => {
  const { data } =
    await axiosInstance.post<components["schemas"]["LoginResponse"]>("/auth/refresh");

  return data.data;
};

export const getCurrentUser = async () => {
  const { data } = await axiosInstance.get<components["schemas"]["UserResponse"]>("/users/me");

  return data.data;
};
