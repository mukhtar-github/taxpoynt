import { NextPageContext } from 'next';
import * as Sentry from '@sentry/nextjs';

interface ErrorProps {
  statusCode?: number;
}

const ErrorPage = ({ statusCode }: ErrorProps) => {
  return (
    <p>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : 'An error occurred on client'}
    </p>
  );
};

ErrorPage.getInitialProps = async ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  if (err) {
    Sentry.captureException(err);
  }
  return { statusCode };
};

export default ErrorPage;