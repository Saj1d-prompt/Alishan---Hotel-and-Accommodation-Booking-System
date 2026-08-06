const ADMIN_TOKEN_KEY =
  "alishan_admin_token";

export function getAdminToken() {
  return localStorage.getItem(
    ADMIN_TOKEN_KEY,
  );
}

export function setAdminToken(
  token,
) {
  localStorage.setItem(
    ADMIN_TOKEN_KEY,
    token,
  );
}

export function removeAdminToken() {
  localStorage.removeItem(
    ADMIN_TOKEN_KEY,
  );
}