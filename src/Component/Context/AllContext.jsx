import  { createContext, useContext } from "react";

const AllContext = createContext();

export const useAllContext = () => useContext(AllContext);

export const AllProvider = ({ children }) => {
 

  return (
    <AllContext.Provider value={{  }}>
      {children}
    </AllContext.Provider>
  );
};
