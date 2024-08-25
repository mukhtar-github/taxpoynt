import { getLoggedInUser } from '@/lib/actions/user.actions';
import RootLayout from './(root)/layout';

async function InitialDataWrapper({ children }: { children: React.ReactNode }) {
  const initialUser = await getLoggedInUser();

  return <RootLayout initialUser={initialUser}>{children}</RootLayout>;
}

export default InitialDataWrapper;