import React, { createContext, useContext, useState } from "react";

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  mobileNumber: string;
  createdAt: string;
  updatedAt: string;
}

interface UserContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvide = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
    const context = useContext(UserContext);

    if(!context){
        throw new Error ("User must be used within a UserProvider");
    }
    return context;
}