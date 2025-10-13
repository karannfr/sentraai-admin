import { create } from "zustand";
import { getSession } from "better-auth/api";

type SessionStore = {
  session: any | null;
  getSession: () => Promise<void>;
};

const useSessionStore = create<SessionStore>((set) => ({
  session: null,
  getSession: async () => {
    try {
      const session = await getSession();
      set({ session });
    } catch (err) {
      console.error("Failed to get session:", err);
      set({ session: null });
    }
  },
}));

export default useSessionStore;
