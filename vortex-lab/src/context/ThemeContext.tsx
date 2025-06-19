import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Simple initialization without complex logic
  const [theme, setTheme] = useState<Theme>("dark");
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme from localStorage after component mounts
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && !isInitialized) {
        const savedTheme = localStorage.getItem("theme") as Theme | null;
        if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
          setTheme(savedTheme);
        }
        setIsInitialized(true);
      }
    } catch (error) {
      console.warn("Failed to read theme from localStorage:", error);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Apply theme to document
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && isInitialized) {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
        localStorage.setItem("theme", theme);
      }
    } catch (error) {
      console.warn("Failed to apply theme:", error);
    }
  }, [theme, isInitialized]);

  const toggleTheme = () => {
    try {
      setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    } catch (error) {
      console.warn("Failed to toggle theme:", error);
    }
  };

  const value: ThemeContextType = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Return a fallback instead of throwing an error
    console.warn(
      "useTheme must be used within a ThemeProvider, using fallback",
    );
    return {
      theme: "dark",
      toggleTheme: () => {
        console.warn("Theme toggle not available outside ThemeProvider");
      },
    };
  }
  return context;
}
