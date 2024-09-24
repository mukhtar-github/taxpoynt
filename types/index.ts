export interface TaxReturn {
  taxReturnId: string;
  taxPeriod: string;
  documentUrl: string;
  status: string;
  // Add any other required properties here
}

export interface SignUpParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  // Add any other required properties here
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  // Add any other required properties here
}

// **Add the DashboardLayoutProps interface**
export interface DashboardLayoutProps {
  children: React.ReactNode;
  // Add any other props required by your layout here
}