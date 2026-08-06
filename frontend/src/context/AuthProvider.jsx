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
  const [user, setUser] =
    useState(null);

  /*
   * If a saved token exists, authentication
   * verification must finish before protected
   * routes decide whether to redirect.
   */
  const [isLoading, setIsLoading] =
    useState(
      () => Boolean(getAdminToken()),
    );

  /*
   * Initial authentication check.
   *
   * We intentionally do NOT call refreshUser()
   * directly from this effect because that
   * function performs immediate state updates,
   * which React 19's lint rules correctly flag.
   *
   * State updates here occur after the async
   * request resolves.
   */
  useEffect(() => {
    const token = getAdminToken();

    if (!token) {
      return undefined;
    }

    let cancelled = false;

    getAdminUser()
      .then((admin) => {
        if (cancelled) {
          return;
        }

        setUser(admin);
      })
      .catch(() => {
        removeAdminToken();

        if (cancelled) {
          return;
        }

        setUser(null);
      })
      .finally(() => {
        if (cancelled) {
          return;
        }

        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Can be called manually after authentication
   * state needs to be revalidated.
   */
  const refreshUser =
    useCallback(async () => {
      const token = getAdminToken();

      if (!token) {
        setUser(null);
        setIsLoading(false);

        return null;
      }

      setIsLoading(true);

      try {
        const admin =
          await getAdminUser();

        setUser(admin);

        return admin;
      } catch (error) {
        removeAdminToken();
        setUser(null);

        throw error;
      } finally {
        setIsLoading(false);
      }
    }, []);

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

  const value = useMemo(
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