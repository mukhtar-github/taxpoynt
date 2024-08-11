'use server'

import { ID } from "node-appwrite"
import { createAdminClient, createSessionClient } from "../appwrite"
import { cookies } from "next/headers"
import { generateTaxpoyntId, parseStringify } from "../utils"
import authenticateAccount from "../mono"

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  //APPWRITE_TAX_RETURN_COLLECTION_ID: TAX_RETURN_COLLECTION_ID,
} = process.env;

export const signIn = async ({ email, password }: signInProps) => {
  try {
    // Mutation / Database query / Make a fetch request
    const { account } = await createAdminClient();

    const response = await account.createEmailPasswordSession(email, password);

    return parseStringify(response);

  } catch (error) {
    console.error('Error', error) 
  }
}

export const signUp = async ({ password, ...userData }: SignUpParams) => {

  const { email, first_name, last_name } = userData;

  let newUserAccount;

  // Generate a unique Taxpoynt ID for the user
  const taxpoyntId = generateTaxpoyntId();  // Use the function to generate the ID

  try {
    const { account, database } = await createAdminClient();

    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${first_name} ${last_name}`
    );

    if(!newUserAccount) throw new Error('Error creating user account');

    // Create a new user document in the Appwrite database with Taxpoynt ID
    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
        taxpoyntId,  // Storing the generated Taxpoynt ID in the user's profile
      }
    );
  
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUser);

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

    // Update the user document with the Mono Account ID
    const updatedUserDocument = await database.updateDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      DOCUMENT_ID,
      { accountId } // Only update the accountId field
    );

    return parseStringify(updatedUserDocument);

  } catch (error) {
    console.error('Error updating user with Mono Account ID', error);
    throw error; // Rethrow the error for upstream handling
  }
};

export const linkMonoAccount = async ({ DOCUMENT_ID, authorizationToken }: { DOCUMENT_ID: string; authorizationToken: string; }) => {
  try {
    // Call the Mono API to exchange the token for an Account ID
    const accountId = await authenticateAccount(authorizationToken);

    // Update the user document with the Mono Account ID
    const updatedUser = await updateUserWithMonoAccountId({ DOCUMENT_ID, accountId });

    return updatedUser;

  } catch (error) {
    console.error('Error linking Mono account', error);
  }
};

export const getLoggedInUser = async () => {
  try {
    const { account } = await createSessionClient();

    const user = await account.get();

    return parseStringify(user);
  } catch (error) {
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