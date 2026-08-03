import { useState } from "react";

import LayoutContext from "@/context/layout-context";

const LayoutProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((current) => !current);
  };

  const value = {
    collapsed,
    toggleSidebar,
  };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutProvider;