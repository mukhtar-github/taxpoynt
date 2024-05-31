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

const AuthForm = ({ type }: { type: string }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)

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
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setLoading(true)
    console.log(values)
    setLoading(false)
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

                                    <CustomInput
                                        form={form}
                                        name='business'
                                        label='Business Name'
                                        placeholder='Enter your business name'
                                        type='business'
                                    />

                                    <CustomInput
                                        form={form}
                                        name='address'
                                        label='Business Address'
                                        placeholder='Enter your business address'
                                        type='address'
                                    />

                                    <CustomInput
                                        form={form}
                                        name='state'
                                        label='State'
                                        placeholder='Enter your state'
                                        type='state'
                                    />

                                    <CustomInput
                                        form={form}
                                        name='date'
                                        label='Date of Registration'
                                        placeholder='Enter your date of registration'
                                        type='date'
                                    />

                                    <CustomInput
                                        form={form}
                                        name='phone'
                                        label='Phone Number'
                                        placeholder='Enter your phone number'
                                        type='phone'
                                    />

                                    <CustomInput
                                        form={form}
                                        name='taxId'
                                        label='Tax ID'
                                        placeholder='Enter your Tax Identification Number (TIN)'
                                        type='taxId'
                                    />

                                </> 
                            )}

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