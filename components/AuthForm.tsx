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

    // 1. Define your form.
  const form = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
        email: "",
        password: ""
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof authFormSchema>) {
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
                        </form>
                    </Form>
                </>
            )}
    </section>
  )
}

export default AuthForm