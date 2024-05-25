import { create } from "zustand";

type TShortLinkResult = {
  shortLink: string;
  dialogOpen: boolean;
  setShortLink: (shortLink: string) => void;
  setDialogOpen: (dialogOpen: boolean) => void;
};

export const useShortlinkResultStore = create<TShortLinkResult>((set) => ({
  shortLink: "",
  dialogOpen: false,
  setShortLink: (shortLink) => set({ shortLink }),
  setDialogOpen: (dialogOpen) => set({ dialogOpen }),
}));
