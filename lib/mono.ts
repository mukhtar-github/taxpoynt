"use server";
import axios from 'axios';

const authenticateAccount = async (authorizationToken: string): Promise<string> => {
  const MONO_API_URL = 'https://api.withmono.com/account/auth';

  try {
    const response = await axios.post(MONO_API_URL, {
      code: authorizationToken,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'mono-sec-key': process.env.MONO_SECRET_KEY, // Ensure you have your Mono secret key in your environment variables
      },
    });

    if (response.data && response.data.id) {
      return response.data.id; // Assuming the Account ID is in the 'id' field of the response
    } else {
      throw new Error('Invalid response from Mono API');
    }
  } catch (error) {
    console.error('Error exchanging token for Mono Account ID', error);
    throw error;
  }
};

export default authenticateAccount;
