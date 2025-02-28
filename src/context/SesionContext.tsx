import { createContext, useContext, useState, ReactNode } from "react";

interface SesionContextType {
  dialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  setDialogOpen: (value: boolean) => void;
  removeToken: () => void;
  setNavigateTo: (value: string) => void;
  navigateTo: string;
}

const SesionContext = createContext<SesionContextType | undefined>(undefined);

export function SesionProvider({ children }: { children: ReactNode }) {

  const [dialogOpen, setDialogOpen] = useState(false);
  const [navigateTo, setNavigateTo] = useState("profile");


  const removeToken = () => {
    localStorage.removeItem("token");
  };

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  return (
    <SesionContext.Provider value={{ removeToken, openDialog, closeDialog, dialogOpen, setDialogOpen, setNavigateTo ,navigateTo }}>
      {children}
    </SesionContext.Provider>
  );
}

export const useSesion = () => {
  const context = useContext(SesionContext);
  if (!context) throw new Error("useSesion must be used within a SesionProvider");
  return context;
};