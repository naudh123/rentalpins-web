"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  subscribeSavedListings,
  saveListing,
  unsaveListing,
  type SavedListing,
} from "@/lib/saved-listings";

interface SavedListingsContextValue {
  savedListingIds: Set<string>;
  isSaved: (listingId: string) => boolean;
  toggleSaved: (listingId: string) => Promise<void>;
  loaded: boolean;
}

const SavedListingsContext =
  createContext<SavedListingsContextValue | null>(null);

export function SavedListingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [loaded, setLoaded] = useState(false);
  const [items, setItems] = useState<SavedListing[]>([]);

  useEffect(() => {
    if (!user) {
      setItems([]);
      setLoaded(true);
      return;
    }
    setLoaded(false);
    return subscribeSavedListings(user.uid, (next) => {
      setItems(next);
      setLoaded(true);
    }, () => setLoaded(true));
  }, [user]);

  const savedListingIds = useMemo(() => {
    return new Set(items.map((s) => s.listingId));
  }, [items]);

  const isSaved = useCallback(
    (listingId: string) => savedListingIds.has(listingId),
    [savedListingIds]
  );

  const toggleSaved = useCallback(
    async (listingId: string) => {
      if (!user) return;
      if (savedListingIds.has(listingId)) {
        await unsaveListing(user.uid, listingId);
      } else {
        await saveListing(user.uid, listingId);
      }
    },
    [savedListingIds, user]
  );

  const value = useMemo<SavedListingsContextValue>(
    () => ({
      savedListingIds,
      isSaved,
      toggleSaved,
      loaded,
    }),
    [savedListingIds, isSaved, toggleSaved, loaded]
  );

  return (
    <SavedListingsContext.Provider value={value}>
      {children}
    </SavedListingsContext.Provider>
  );
}

export function useSavedListings(): SavedListingsContextValue {
  const ctx = useContext(SavedListingsContext);
  if (!ctx) throw new Error("useSavedListings must be used within SavedListingsProvider");
  return ctx;
}

