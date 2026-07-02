"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type { KnowledgeBasePaperResponse } from "@/lib/knowledge-base-model";

type KnowledgeBasePanelContextValue = {
  open: boolean;
  selectedPaper: KnowledgeBasePaperResponse | null;
  previewPaper: (paper: KnowledgeBasePaperResponse) => void;
  setSelectedPaper: (paper: KnowledgeBasePaperResponse | null) => void;
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
  const [selectedPaper, setSelectedPaper] =
    useState<KnowledgeBasePaperResponse | null>(null);
  const toggle = useCallback(() => {
    setOpen((currentOpen) => !currentOpen);
  }, []);
  const previewPaper = useCallback((paper: KnowledgeBasePaperResponse) => {
    setSelectedPaper(paper);
  }, []);
  const value = useMemo(
    () => ({
      open,
      previewPaper,
      selectedPaper,
      setSelectedPaper,
      setOpen,
      toggle,
    }),
    [open, previewPaper, selectedPaper, toggle],
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
