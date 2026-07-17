"use client";

import {
  PERSONA_STORAGE_KEY,
  type PortalPersona,
  isPortalPersona,
} from "@/lib/psap-portal/personas";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Ctx = {
  persona: PortalPersona | null;
  ready: boolean;
  setPersona: (p: PortalPersona) => void;
  clearPersona: () => void;
};

const PersonaContext = createContext<Ctx>({
  persona: null,
  ready: false,
  setPersona: () => {},
  clearPersona: () => {},
});

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [persona, setPersonaState] = useState<PortalPersona | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PERSONA_STORAGE_KEY);
      if (isPortalPersona(raw)) setPersonaState(raw);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const setPersona = useCallback((p: PortalPersona) => {
    setPersonaState(p);
    try {
      localStorage.setItem(PERSONA_STORAGE_KEY, p);
    } catch {
      /* ignore */
    }
  }, []);

  const clearPersona = useCallback(() => {
    setPersonaState(null);
    try {
      localStorage.removeItem(PERSONA_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ persona, ready, setPersona, clearPersona }),
    [persona, ready, setPersona, clearPersona]
  );

  return (
    <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>
  );
}

export function usePersona() {
  return useContext(PersonaContext);
}
