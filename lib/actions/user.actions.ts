'use server'

import { ID } from "node-appwrite"
import { createAdminClient, createSessionClient } from "../appwrite"
import { cookies } from "next/headers"
import { parseStringify } from "../utils"
import authenticateAccount from "../mono"
import { setUserAsAdmin } from "./admin.actions"

const {
  NEXT_PUBLIC_APPWRITE_DATABASE_ID: DATABASE_ID,
  NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
} = process.env;

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient();
    const response = await account.createEmailPasswordSession(email, password);
    
    cookies().set("auth_token", response.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return parseStringify(response);
  } catch (error) {
    console.error('Error', error) 
  }
}

export const signUp = async ({ password, ...userData }: SignUpParams) => {

  const { email, first_name, last_name } = userData;

  let newUserAccount;

  try {
    const { account, database } = await createAdminClient();

    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${first_name} ${last_name}`
    );

    if(!newUserAccount) throw new Error('Error creating user account');

    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
        accountId: null,
        isAdmin: false, // Set isAdmin to false initially
      }
    );
  
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    // Check if the user should be an admin
    const { isAdmin } = await setUserAsAdmin(newUser.$id, email);

    return parseStringify({ ...newUser, isAdmin });

  } catch (error) {
    console.error('Error', error) 
  }

}

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
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      DOCUMENT_ID,
      { accountId } // Make sure this matches the field name in your Appwrite database
    );

    return parseStringify(updatedUserDocument);

  } catch (error) {
    console.error('Error updating user with Mono Account ID', error);
    throw error;
  }
};

export const linkMonoAccount = async ({ DOCUMENT_ID, authorizationToken }: { DOCUMENT_ID: string; authorizationToken: string; }) => {
  try {
    // Call the Mono API to exchange the token for an Account ID
    const accountId = await authenticateAccount(authorizationToken, DOCUMENT_ID, 'link');

    if (!accountId) {
      throw new Error('Failed to authenticate account with Mono');
    }

    // Update the user document with the Mono Account ID
    const updatedUser = await updateUserWithMonoAccountId({ DOCUMENT_ID, accountId });

    if (!updatedUser) {
      throw new Error('Failed to update user with Mono Account ID');
    }

    // Return a success response with the updated user data
    return {
      success: true,
      message: 'Account linked successfully',
      user: updatedUser
    };

  } catch (error) {
    console.error('Error linking Mono account', error);
    // Return an error response
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred while linking the account',
      error: error
    };
  }
};

export const getLoggedInUser = async () => {
  try {
    const { account, database } = await createAdminClient();
    const session = await account.getSession('current');
    const user = await database.getDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      session.userId
    );
    return parseStringify(user);
  } catch (error) {
    console.error('Error getting logged in user:', error);
    return null;
  }
}

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();

    cookies().delete("appwrite-session");

    await account.deleteSession("current");

  } catch (error) {
    return null; 
  }
}

export async function updateUserReauthStatus({ DOCUMENT_ID, requiresReauth, reauthUrl }: { DOCUMENT_ID: string, requiresReauth: boolean, reauthUrl?: string }) {
    try {
        const { database } = await createAdminClient();
        const updatedUser = await database.updateDocument(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            DOCUMENT_ID,
            { requiresReauth, reauthUrl }
        );
        return updatedUser;
    } catch (error) {
        console.error('Error updating user reauth status:', error);
        throw new Error('Failed to update user reauth status');
    }
}