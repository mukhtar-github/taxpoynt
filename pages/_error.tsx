import { NextPageContext } from 'next';
import App, { AppProps, AppContext } from 'next/app';

function MyError({ res, err, pathname, query }: NextPageContext) {
  // Your error handling logic
}

MyError.getInitialProps = async ({ res, err, pathname, query, AppTree }: NextPageContext) => {
  return { res, err, pathname, query, AppTree };
};

export default MyError;