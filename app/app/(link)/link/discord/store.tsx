"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type LinkCodeStore = {
  linkCode: string;
  setLinkCode: (code: string) => void;
  clearLinkCode: () => void;
};

export const useLinkCodeStore = create<LinkCodeStore>()(
  persist(
    (set) => ({
      linkCode: "",
      setLinkCode: (code) => set({ linkCode: code }),
      clearLinkCode: () => set({ linkCode: "" }),
    }),
    {
      name: "discord-link-code",
    },
  ),
);
