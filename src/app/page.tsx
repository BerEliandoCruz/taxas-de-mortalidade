"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { LoginForm } from "@/components/login-form";
import { AppSidebar } from "@/components/app-sidebar";
import { Dashboard } from "@/components/dashboard";
import { Curiosities } from "@/components/curiosities";
import { Quiz } from "@/components/quiz";
import { Ranking } from "@/components/ranking";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Lightbulb, HelpCircle, Trophy } from "lucide-react";
import type { User } from "@/lib/store";

const sectionTitles: Record<string, { title: string; icon: React.ReactNode }> = {
  dashboard: { title: "Dashboard", icon: <BarChart3 className="h-5 w-5" /> },
  curiosities: { title: "Curiosidades", icon: <Lightbulb className="h-5 w-5" /> },
  quiz: { title: "Quiz", icon: <HelpCircle className="h-5 w-5" /> },
  ranking: { title: "Ranking", icon: <Trophy className="h-5 w-5" /> },
};

export default function HomePage() {
  const { isAuthenticated, activeSection, setUser } = useAppStore();

  // Check session on mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Not authenticated");
      })
      .then((data) => {
        if (data?.user) {
          setUser(data.user as User);
        }
      })
      .catch(() => {
        // Not authenticated, stay on login
      });
  }, [setUser]);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const currentSection = sectionTitles[activeSection];

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "curiosities":
        return <Curiosities />;
      case "quiz":
        return <Quiz />;
      case "ranking":
        return <Ranking />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
            <div className="flex items-center justify-between px-4 lg:px-8 py-4">
              <div className="flex items-center gap-3 pl-12 lg:pl-0">
                {currentSection?.icon}
                <h1 className="text-lg font-semibold">{currentSection?.title}</h1>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-4 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-border py-4 px-6 text-center">
        <p className="text-xs text-muted-foreground">
          Dados baseados na Tábua Completa de Mortalidade para o Brasil — IBGE 2024
        </p>
      </footer>
    </div>
  );
}
