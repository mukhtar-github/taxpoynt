'use server'

import { createSessionClient } from "../appwrite"

export const signIn = async () => {
    try {
        // Mutation / Database query / Make a fetch request
    } catch (error) {
       console.error('Error', error) 
    }
}

export const signUp = async (userData: SignUpParams) => {
    try {
        // Use Appwrite SDK to create a new user
    } catch (error) {
       console.error('Error', error) 
    }
}

export async function getLoggedInUser() {
    try {
      const { account } = await createSessionClient();
      return await account.get();
    } catch (error) {
      return null;
    }
  }
//The  getLoggedInUser  function returns the logged-in user.
