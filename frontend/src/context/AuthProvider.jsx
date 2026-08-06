import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import AuthContext from "@/context/AuthContext";

import {
  adminLogin,
  adminLogout,
  getAdminUser,
} from "@/services/adminAuthApi";

import {
  getAdminToken,
  removeAdminToken,
  setAdminToken,
} from "@/lib/authStorage";

export default function AuthProvider({
  children,
}) {
  const [
    user,
    setUser,
  ] = useState(null);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const refreshUser =
    useCallback(async () => {
      const token =
        getAdminToken();

      if (!token) {
        setUser(null);
        setIsLoading(false);

        return;
      }

      try {
        const admin =
          await getAdminUser();

        setUser(admin);
      } catch {
        removeAdminToken();

        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login =
    useCallback(
      async (
        email,
        password,
      ) => {
        const data =
          await adminLogin({
            email,
            password,
          });

        setAdminToken(
          data.token,
        );

        setUser(
          data.user,
        );

        return data.user;
      },
      [],
    );

  const logout =
    useCallback(async () => {
      try {
        await adminLogout();
      } finally {
        removeAdminToken();
        setUser(null);
      }
    }, []);

  const value =
    useMemo(
      () => ({
        user,
        isLoading,
        isAuthenticated:
          Boolean(user),

        login,
        logout,
        refreshUser,
      }),
      [
        user,
        isLoading,
        login,
        logout,
        refreshUser,
      ],
    );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}