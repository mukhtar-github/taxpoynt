'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";
import { setUserAsAdmin } from "./admin.actions";
import authenticateAccount from "../mono";
import { getEnvVariable } from '../utils';
import { CookieSerializeOptions } from 'cookie';
import { Account } from 'node-appwrite';
import { NextApiRequest } from 'next';
import { SignUpParams } from "types";

const DATABASE_ID = getEnvVariable('NEXT_PUBLIC_APPWRITE_DATABASE_ID');
const USER_COLLECTION_ID = getEnvVariable('NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID');

const COOKIE_OPTIONS: CookieSerializeOptions = {
  path: "/dashboard",
  httpOnly: true,
  sameSite: "strict",
  secure: true,
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export const getUserInfo = async ({ userId }: { userId: string }) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID,
      USER_COLLECTION_ID,
      [Query.equal('userId', [userId])]
    );

    if (!user.documents[0]) {
      throw new Error('User not found');
    }

    // {{ Ensure user data matches the User type }}
    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
    throw error; // {{ Propagate the error }}
  }
};

export const signIn = async ({ email, password }: { email: string, password: string }) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/dashboard",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    const user = await getUserInfo({ userId: session.userId });

    return parseStringify(user);
  } catch (error) {
    console.error('Error', error);
  }
};

export const signUp = async ({ password, ...userData }: SignUpParams) => {
  const { email, firstName, lastName } = userData;

  try {
    const { account, database } = await createAdminClient();

    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    if (!newUserAccount) throw new Error('Error creating user');

    const newUser = await database.createDocument(
      DATABASE_ID,
      USER_COLLECTION_ID,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
        accountId: null,
        isAdmin: false,
      }
    );

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, COOKIE_OPTIONS);

    // Check if the user should be an admin
    const { isAdmin } = await setUserAsAdmin(newUser.$id, email);

    return parseStringify({ ...newUser, isAdmin });
  } catch (error) {
    console.error('Error', error);
  }
};

export async function getLoggedInUser(userId: string) {
  // Your implementation to fetch user data using userId
  // For example:
  const user = await getUserInfo({ userId });
  return user;
}

const USER_REMINDERS_COLLECTION_ID = getEnvVariable('NEXT_PUBLIC_APPWRITE_USER_REMINDERS_COLLECTION_ID');

export async function getUserReminders(userId: string) {
  const { database } = await createAdminClient();
  const reminders = await database.listDocuments(
    DATABASE_ID,
    USER_REMINDERS_COLLECTION_ID,
    [Query.equal('userId', userId)]
  );
  return parseStringify(reminders);
}

export const logoutAccount = async (req: NextApiRequest) => {
  try {
    const client = await createSessionClient(req);
    if (!client) {
      throw new Error('Failed to create session client');
    }
    const account = new Account(client);

    cookies().delete("appwrite-session");

    await account.deleteSession("current");
  } catch (error) {
    return null;
  }
};

export const updateUserWithMonoAccountId = async ({
  DOCUMENT_ID,
  accountId,
}: {
  DOCUMENT_ID: string;
  accountId: string;
}) => {
  try {
    const { database } = await createAdminClient();

    const updatedUserDocument = await database.updateDocument(
      DATABASE_ID,
      USER_COLLECTION_ID,
      DOCUMENT_ID,
      { accountId }
    );

    return parseStringify(updatedUserDocument);
  } catch (error) {
    console.error('Error updating user with Mono Account ID', error);
    throw error;
  }
};

export const getUserByMonoAccountId = async (accountId: string) => {
  try {
    const { database } = await createAdminClient();

    const users = await database.listDocuments(
      DATABASE_ID,
      USER_COLLECTION_ID,
      [Query.equal('accountId', accountId)]
    );

    if (users.documents.length === 0) {
      return null;
    }

    return parseStringify(users.documents[0]);
  } catch (error) {
    console.error('Error getting user by Mono Account ID', error);
    throw error;
  }
};

export const linkMonoAccount = async ({
  DOCUMENT_ID,
  authorizationToken,
}: {
  DOCUMENT_ID: string;
  authorizationToken: string;
}) => {
  try {
    // Call the Mono API to exchange the token for an Account ID
    const accountId = await authenticateAccount(
      authorizationToken,
      DOCUMENT_ID,
      'link'
    );

    if (!accountId) {
      throw new Error('Failed to authenticate account with Mono');
    }

    // Update the user document with the Mono Account ID
    const updatedUser = await updateUserWithMonoAccountId({
      DOCUMENT_ID,
      accountId,
    });

    if (!updatedUser) {
      throw new Error('Failed to update user with Mono Account ID');
    }

    // Return a success response with the updated user data
    return {
      success: true,
      message: 'Account linked successfully',
      user: updatedUser,
    };
  } catch (error) {
    console.error('Error linking Mono account', error);
    // Return an error response
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'An unknown error occurred while linking the account',
      error: error,
    };
  }
};

export async function updateUserReauthStatus({
  DOCUMENT_ID,
  requiresReauth,
  reauthUrl,
}: {
  DOCUMENT_ID: string;
  requiresReauth: boolean;
  reauthUrl?: string;
}) {
  try {
    const { database } = await createAdminClient();
    const updatedUser = await database.updateDocument(
      DATABASE_ID,
      USER_COLLECTION_ID,
      DOCUMENT_ID,
      { requiresReauth, reauthUrl }
    );
    return updatedUser;
  } catch (error) {
    console.error('Error updating user reauth status:', error);
    throw new Error('Failed to update user reauth status');
  }
}