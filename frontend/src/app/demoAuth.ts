type DemoRole = "Educator" | "Reviewer" | "Admin";

export const LOCAL_DEMO_ACCOUNTS: {
  email: string;
  password: string;
  fullName: string;
  role: DemoRole;
}[] = import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEMO_LOGIN === "true"
  ? [
      {
        email: "educator.demo@edumind.local",
        password: "EduMindDemo2026!",
        fullName: "Demo Educator",
        role: "Educator",
      },
      {
        email: "reviewer.demo@edumind.local",
        password: "EduMindDemo2026!",
        fullName: "Demo Executive Director",
        role: "Reviewer",
      },
      {
        email: "admin.demo@edumind.local",
        password: "EduMindDemo2026!",
        fullName: "Demo Administrator",
        role: "Admin",
      },
    ]
  : [];

export function authenticateLocalDemo(email: string, password: string) {
  return LOCAL_DEMO_ACCOUNTS.find(
    (account) =>
      account.email === email.trim().toLowerCase() &&
      account.password === password,
  ) ?? null;
}
