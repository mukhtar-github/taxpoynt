"use client"

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomInput from './CustomInput'
import { authFormSchema } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/actions/user.actions'

const AuthForm = ({ type }: { type: string }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    const formSchema = authFormSchema(type)

    // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        email: "",
        password: ""
    },
  })

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true)
    try {
        // Sign up with Appwrite and create a QuikBooks link token
        if(type === 'sign-up') {
            const newUser = await signUp(data)

            setUser(newUser)
        }

        if(type === 'sign-in') {
            // Sign in with Appwrite
            const response = await signIn({
                email: data.email,
                password: data.password
            })

            if(response) router.push('/')
        }

    } catch (error) {
        console.log(error)
    } finally {
        setLoading(false)
    }
  }

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
                    {user 
                        ? 'Link to dashboard'
                        : type === 'sign-in'
                        ? 'Sign In'
                        : 'Sign Up'
                    }
                    <p className='text-16 font-normal text-gray-600'>
                        {user
                            ? 'Link your account to get started'
                            : 'Please enter your details to continue'
                        }
                    </p>
                </h1>
            </div>
        </header>
            {user ? (
                <div className='flex flex-col gap-4 '>
                    {/* PlaidLink */}
                </div>
            ) : (
                <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {type === 'sign-up' && (
                               <>
                                    <div className='flex gap-4'>
                                        <CustomInput
                                            form={form}
                                            name='firstName'
                                            label='First Name'
                                            placeholder='Enter your first name'
                                            type='firstName'
                                        />
                                        <CustomInput
                                            form={form}
                                            name='lastName'
                                            label='Last Name'
                                            placeholder='Enter your last name'
                                            type='lastName'
                                        />
                                    </div>
                                    <div className='flex gap-4'>
                                        <CustomInput
                                            form={form}
                                            name='businessName'
                                            label='Business Name'
                                            placeholder='Enter your business name'
                                            type='businessName'
                                        />
                                        <CustomInput
                                            form={form}
                                            name='state'
                                            label='State'
                                            placeholder='Enter your state'
                                            type='state'
                                        />
                                    </div>
                                    <div className='flex gap-4'>
                                        <CustomInput
                                            form={form}
                                            name='address1'
                                            label='Business Address'
                                            placeholder='Enter business address'
                                            type='address'
                                        />
                                        <CustomInput
                                            form={form}
                                            name='dateOfReg'
                                            label='Date of Registration'
                                            placeholder='Enter the date of registration'
                                            type='date'
                                        />
                                    </div>
                                    <div className='flex gap-4'>
                                        <CustomInput
                                            form={form}
                                            name='phone'
                                            label='Phone Number'
                                            placeholder='ex. +234 123 456 7890'
                                            type='phone'
                                        />
                                        <CustomInput
                                            form={form}
                                            name='taxId'
                                            label='Tax ID'
                                            placeholder='Enter Tax ID (TIN)'
                                            type='taxId'
                                        />
                                    </div>
                                </> 
                            )}
                            
                            <div className='flex gap-4'>
                                <CustomInput
                                    form={form}
                                    name='email'
                                    label='Email'
                                    placeholder='Enter your email'
                                    type='email'
                                />
                                <CustomInput
                                    form={form}
                                    name='password'
                                    label='Password'
                                    placeholder='Enter your password'
                                    type='password'
                                />
                            </div>

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
  )
}

export default AuthForm