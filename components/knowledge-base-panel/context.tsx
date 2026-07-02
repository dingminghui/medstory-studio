"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type KnowledgeBasePanelContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

const KnowledgeBasePanelContext =
  createContext<KnowledgeBasePanelContextValue | null>(null);

export function KnowledgeBasePanelProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => {
    setOpen((currentOpen) => !currentOpen);
  }, []);
  const value = useMemo(
    () => ({
      open,
      setOpen,
      toggle,
    }),
    [open, toggle],
  );

  return (
    <KnowledgeBasePanelContext.Provider value={value}>
      {children}
    </KnowledgeBasePanelContext.Provider>
  );
}

export function useKnowledgeBasePanel() {
  const context = useContext(KnowledgeBasePanelContext);

  if (!context) {
    throw new Error(
      "useKnowledgeBasePanel must be used within KnowledgeBasePanelProvider.",
    );
  }

  return context;
}
