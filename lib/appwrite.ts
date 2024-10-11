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

export async function createAdminClient() {
	const client = new Client()
		.setEndpoint(getEnvVariable('NEXT_PUBLIC_APPWRITE_ENDPOINT'))
		.setProject(getEnvVariable('NEXT_PUBLIC_APPWRITE_PROJECT'))
		.setKey(getEnvVariable('NEXT_PUBLIC_APPWRITE_KEY'));

	return {
		account: new Account(client),
		database: new Databases(client),
		users: new Users(client),
	};
}

