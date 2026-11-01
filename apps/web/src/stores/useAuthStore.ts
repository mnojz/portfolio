import { create } from "zustand";

interface UserProfile {
  id: string;
  username: string;
  role: "OWNER" | "ADMIN" | "GUEST";
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isOwner: boolean;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("mosswood_token") : null,
  user: typeof window !== "undefined" && localStorage.getItem("mosswood_user")
    ? JSON.parse(localStorage.getItem("mosswood_user")!)
    : null,
  isOwner: typeof window !== "undefined" && localStorage.getItem("mosswood_user")
    ? JSON.parse(localStorage.getItem("mosswood_user")!).role === "OWNER"
    : false,

  login: (token: string, user: UserProfile) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mosswood_token", token);
      localStorage.setItem("mosswood_user", JSON.stringify(user));
    }
    set({
      token,
      user,
      isOwner: user.role === "OWNER" || user.role === "ADMIN",
    });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("mosswood_token");
      localStorage.removeItem("mosswood_user");
    }
    set({
      token: null,
      user: null,
      isOwner: false,
    });
  },
}));

