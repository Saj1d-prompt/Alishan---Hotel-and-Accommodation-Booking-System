import { createContext, useContext, useState } from "react";

const LayoutContext = createContext();

export function LayoutProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <LayoutContext.Provider
      value={{
        collapsed,
        toggleSidebar,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);

  if (!context) {
    throw new Error("useLayout must be used inside LayoutProvider");
  }

  return context;
}