/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { UserPreferences } from "@/types/article";
import { PreferencesStorage, defaultPreferences } from "@/utils/storage";

interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (preferences: UserPreferences) => void;
  resetPreferences: () => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined
);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] =
    useState<UserPreferences>(defaultPreferences);

  useEffect(() => {
    const loadedPreferences = PreferencesStorage.load();
    setPreferences(loadedPreferences);
  }, []);

  const updatePreferences = (newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
    PreferencesStorage.save(newPreferences);
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    PreferencesStorage.clear();
  };

  return (
    <PreferencesContext.Provider
      value={{ preferences, updatePreferences, resetPreferences }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }
  return context;
}
