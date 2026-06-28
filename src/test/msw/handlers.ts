import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("/api/v1/auth/login", () =>
    HttpResponse.json({
      success: true,
      data: { accessToken: "test-access-token", roles: ["TECHNICIAN"] },
    }),
  ),
];
