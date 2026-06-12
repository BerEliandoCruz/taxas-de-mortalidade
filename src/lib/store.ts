import { create } from "zustand";

export type Section = "dashboard" | "curiosities" | "quiz" | "ranking";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;

  // Navigation
  activeSection: Section;
  setActiveSection: (section: Section) => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),
  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      activeSection: "dashboard",
    }),

  // Navigation
  activeSection: "dashboard",
  setActiveSection: (section) => set({ activeSection: section }),

  // Sidebar
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
