export const sidebarLinks = [
  {
    imgURL: "/icons/dashboard.svg",
    route: "/",
    label: "Dashboard",
  },
  {
    imgURL: "/icons/tax-returns.svg",
    route: "/tax-returns",
    label: "My Tax Returns",
  },
  {
    imgURL: "/icons/transactions.svg",
    route: "/transactions",
    label: "Transactions",
  },
  {
    imgURL: "/icons/documents.svg",
    route: "/documents",
    label: "Documents",
  },
  {
    imgURL: "/icons/tax-form.svg",
    route: "/tax-form",
    label: "Tax Form",
  },
  {
    imgURL: "/icons/admin.svg",
    route: "/tax-management",
    label: "Tax Management",
    adminOnly: true,  // Admin-only link
  },
];

// Removed sensitive test access tokens from the repository.
// Instead, use environment variables to manage sensitive data.
// Example:
// export const TEST_ACCESS_TOKEN = process.env.TEST_ACCESS_TOKEN || '';