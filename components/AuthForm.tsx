"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useCallback } from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { authFormSchema } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/actions/user.actions';
import { toast } from 'react-hot-toast';
import { fetchUserData } from '@/lib/server';
import LinkUser from './LinkUser';
import SignUpFields from './SignUpFields';
import SignInFields from './SignInFields';
import { useUser } from 'hooks/useUser';

interface AuthFormProps {
    type: 'sign-in' | 'sign-up';
}

interface SignUpParams {
    firstName: string;
    lastName: string;
    businessName: string;
    address: string;
    state: string;
    businessRegDate: string;
    phone: string;
    identificationNo: string;
    email: string;
    password: string;
}

const AuthForm = ({ type }: AuthFormProps) => {
    const { user, setUser } = useUser();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAccountLinked = useCallback(async () => {
        if (!user) return; // Add null check for user

        try {
            const updatedUserData = await fetchUserData(user.id); // Pass the user ID here
            if (updatedUserData) {
                setUser(updatedUserData);
                toast.success('Account linked successfully!');
                router.push('/dashboard'); // Redirect to Dashboard after linking
            }
        } catch (error) {
            console.error('Failed to update user data:', error);
            toast.error('Failed to update user data. Please try again.');
        }
    }, [router, setUser, user?.id]); // Use user?.id to handle null

    useEffect(() => {
      let intervalId: NodeJS.Timeout;
      if (user && user.accountId === null) {
        intervalId = setInterval(async () => {
          const updatedUserData = await fetchUserData(user.id); // Pass the user ID here
          if (updatedUserData && updatedUserData.accountId) {
            clearInterval(intervalId);
            handleAccountLinked();
          }
        }, 5000);
      }
      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }, [user, handleAccountLinked]);

    const formSchema = authFormSchema(type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setLoading(true);

        try {
            if(type === 'sign-up') {
                const userData: SignUpParams = {
                    firstName: data.firstName!,
                    lastName: data.lastName!,
                    businessName: data.businessName!,
                    address: data.address!,
                    state: data.state!,
                    businessRegDate: data.businessRegDate!,
                    phone: data.phone!,
                    identificationNo: data.identificationNo!,
                    email: data.email,
                    password: data.password
                };

                const newUser = await signUp(userData);
                toast.success('Sign up successful! Please link your account.');
                setUser(newUser); // Update user state after sign-up
            }

            if(type === 'sign-in') {
                const response = await signIn({
                    email: data.email,
                    password: data.password
                });

                if(response) {
                    toast.success('Sign in successful!');
                    setUser(response); // Update user state after sign-in
                    router.push('/dashboard'); // Redirect to Dashboard after sign-in
                }
            }

        } catch (error) {
            console.error(error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='auth-form'>
            <header className='flex flex-col gap-5 md:gap-8'>
                <Link href='/' className='cursor-pointer items-center flex gap-1'>
                    <Image 
                        alt='Taxpoynt Logo' 
                        src='/icons/logo-fav.svg' 
                        width={34}
                        height={34}
                    />
                    <h1 className='text-26 font-ibm-plex-serif font-bold text-black-1'>Taxpoynt</h1>
                </Link>
                <div className='flex flex-col gap-1 md:gap-3'>
                    <h1 className='tex-24 lg:text-36 font-semibold text-gray-900'>
                        {user && user.accountId === null
                            ? 'Link Your Account'
                            : type === 'sign-in'
                            ? 'Sign In'
                            : 'Sign Up'
                        }
                    </h1>
                    <p className='text-16 font-normal text-gray-600'>
                        {user && user.accountId === null
                            ? 'Link your account to get started'
                            : 'Please enter your details to continue'
                        }
                    </p>
                </div>
            </header>
            {user && user.accountId === null ? (
                <div className='flex flex-col gap-4 '>
                    <LinkUser onAccountLinked={handleAccountLinked} />
                </div>
            ) : (
                <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {type === 'sign-up' ? (
                                <SignUpFields form={form} />
                            ) : (
                                <SignInFields form={form} />
                            )}

                            <div className='flex flex-col gap-4'>
                                <Button type="submit" className='form-btn' disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2
                                                size={20}
                                                className='animate-spin'
                                            /> &nbsp; Loading...
                                        </>
                                    ) : type === 'sign-in' ? 'Sign In' : 'Sign Up'}
                                </Button>
                            </div>
                        </form>    
                    </Form>

                    <footer className='flex justify-center gap-1'>
                        <p className='text-14 font-normal text-grey-600'>
                            {
                                type === 'sign-in' 
                                ? "Don't have an account?" 
                                : "Already have an account?"
                            }
                        </p>

                        <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className='form-link'>
                            {type === 'sign-in' ? 'Sign up' : 'Sign in'}
                        </Link>
                    </footer>
                </>
            )}
        </section>
    );
};

export default AuthForm;