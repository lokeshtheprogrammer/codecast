
import { User, UserRole } from "./types";
import { getCurrentUser, login as dataLogin, logout as dataLogout, register as dataRegister } from "./data";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole | null;
}

// Initial auth state
let authState: AuthState = {
  user: null,
  isAuthenticated: false,
  role: null,
};

// Set up auth state based on localStorage on init
function initAuth(): void {
  const storedUser = localStorage.getItem("codecast_user");
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser) as User;
      authState = {
        user,
        isAuthenticated: true,
        role: user.role,
      };
    } catch (error) {
      console.error("Error parsing stored user:", error);
      localStorage.removeItem("codecast_user");
    }
  }
}

// Initialize on module load
initAuth();

// Auth service functions
export function getAuthState(): AuthState {
  return { ...authState };
}

export function login(email: string, password: string): Promise<User> {
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      const user = dataLogin(email, password);
      if (user) {
        authState = {
          user,
          isAuthenticated: true,
          role: user.role,
        };
        localStorage.setItem("codecast_user", JSON.stringify(user));
        resolve(user);
      } else {
        reject(new Error("Invalid email or password"));
      }
    }, 500);
  });
}

export function logout(): Promise<void> {
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(() => {
      dataLogout();
      authState = {
        user: null,
        isAuthenticated: false,
        role: null,
      };
      localStorage.removeItem("codecast_user");
      resolve();
    }, 300);
  });
}

export function register(username: string, email: string, password: string, role: UserRole): Promise<User> {
  return new Promise((resolve, reject) => {
    // Check if username or email already exists
    // In a real app, this would be done on the backend
    const storedUser = localStorage.getItem("codecast_user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        if (user.email === email) {
          reject(new Error("Email already registered"));
          return;
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    }

    // Simulate API call
    setTimeout(() => {
      const user = dataRegister(username, email, password, role);
      if (user) {
        authState = {
          user,
          isAuthenticated: true,
          role: user.role,
        };
        localStorage.setItem("codecast_user", JSON.stringify(user));
        resolve(user);
      } else {
        reject(new Error("Registration failed"));
      }
    }, 800);
  });
}

export function isAuthenticated(): boolean {
  return authState.isAuthenticated;
}

export function hasRole(role: UserRole | UserRole[]): boolean {
  if (!authState.isAuthenticated || !authState.role) return false;
  
  if (Array.isArray(role)) {
    return role.includes(authState.role);
  }
  
  return authState.role === role;
}

export function requireAuth(roles?: UserRole | UserRole[]): boolean {
  if (!isAuthenticated()) return false;
  if (!roles) return true;
  return hasRole(roles);
}

export { getCurrentUser };
