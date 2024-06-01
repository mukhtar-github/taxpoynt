'use server'

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

// const response = await fetch('/api/auth/sign-in', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(data)
    // })

    // if(response.ok) {
    //     return response.json()
    // } else {
    //     return null
    // }
