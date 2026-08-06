import apiClient from "@/lib/apiClient";

export async function adminLogin(
  credentials,
) {
  const response =
    await apiClient.post(
      "/admin/login",
      credentials,
    );

  return response.data.data;
}

export async function getAdminUser() {
  const response =
    await apiClient.get(
      "/admin/me",
    );

  return response.data.data;
}

export async function adminLogout() {
  await apiClient.post(
    "/admin/logout",
  );
}