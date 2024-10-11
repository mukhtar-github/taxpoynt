"use server";

import { Client, Account, Databases, Users } from "appwrite";
import { getEnvVariable } from "./utils"; // Adjust the path based on your project structure
import { NextApiRequest } from "next"; // Add this import

export async function createSessionClient(req: NextApiRequest) {
	const client = new Client();

	// Retrieve the session token from cookies
	const sessionToken = req.cookies['appwrite-session'];

	if (!sessionToken) {
		throw new Error('Session token not found in cookies.');
	}

	client
		.setEndpoint(getEnvVariable('NEXT_PUBLIC_APPWRITE_ENDPOINT'))
		.setProject(getEnvVariable('NEXT_PUBLIC_APPWRITE_PROJECT'))
		.setSession(sessionToken); // Ensure the session token is set

	return client;
}

const client = new Client()
	.setEndpoint(getEnvVariable('NEXT_PUBLIC_APPWRITE_ENDPOINT'))
	.setProject(getEnvVariable('NEXT_PUBLIC_APPWRITE_PROJECT'));
// Remove .setKey as it's not a function in the current Appwrite SDK version

const createAdminClient = () => {
	return {
		account: new Account(client),
		// If you need to set a key for admin operations, use the appropriate method or SDK capabilities.
	};
}

export { createAdminClient };

