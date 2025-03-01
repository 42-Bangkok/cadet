"use client";

import { useLinkCodeStore } from "../../store";

interface IStoreHandler {
  token: string;
}

export function StoreHandler(p: IStoreHandler) {
  const setLinkCode = useLinkCodeStore.getState().setLinkCode;
  setLinkCode(p.token);
  return null;
}
