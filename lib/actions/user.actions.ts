'use server'

import { ID } from "node-appwrite"
import { createAdminClient, createSessionClient } from "../appwrite"
import { cookies } from "next/headers"
import { generateTaxpoyntId, parseStringify } from "../utils"

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_TAX_RETURN_COLLECTION_ID: TAX_RETURN_COLLECTION_ID,
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

  const { email, firstName, lastName } = userData;

  let newUserAccount;

  // Generate a unique Taxpoynt ID for the user
  const taxpoyntId = generateTaxpoyntId();  // Use the function to generate the ID

  try {
    const { account, database } = await createAdminClient();

    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
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

export const createTaxReturn = async ({
  taxReturnId,
  userId,
  taxYear,
  taxTypeId,
  status,
  documentUrl,
}: createTaxReturnProps) => {
  try {
    const { database } = await createAdminClient();

    // Assuming you have a specific collection for tax returns
    const taxReturn = await database.createDocument(
      DATABASE_ID!,
      TAX_RETURN_COLLECTION_ID!,
      ID.unique(),
      {
        taxReturnId,
        userId,
        taxYear,
        taxTypeId,
        status,
        documentUrl,
      }
    );

    return parseStringify(taxReturn);

  } catch (error) {
    console.error(error);
  }
}
