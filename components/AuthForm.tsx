"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useCallback } from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorOption, Field, FieldArray, FieldArrayPath, FieldError, FieldErrors, FieldName, FieldRefs, FieldValues, FormState, InternalFieldName, RegisterOptions, SubmitErrorHandler, SubmitHandler, useForm, UseFormRegisterReturn } from "react-hook-form";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { authFormSchema } from 'lib/utils';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from 'lib/actions/user.actions';
import { toast } from 'react-hot-toast';
import { fetchUserData } from 'lib/server';
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
                    <Form form={{
                            watch: {},
                            getValues: {},
                            getFieldState: function <TFieldName extends string>(name: TFieldName, formState?: FormState<any> | undefined): { invalid: boolean; isDirty: boolean; isTouched: boolean; isValidating: boolean; error?: FieldError; } {
                                throw new Error('Function not implemented.');
                            },
                            setError: function (name: string, error: ErrorOption, options?: { shouldFocus: boolean; }): void {
                                throw new Error('Function not implemented.');
                            },
                            clearErrors: function (name?: string | string[] | readonly string[] | undefined): void {
                                throw new Error('Function not implemented.');
                            },
                            setValue: function <TFieldName extends string = string>(name: TFieldName, value: TFieldName extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends string ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends string ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends string ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends string ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends string ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends string ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends string ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends string ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends string ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends string ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends string ? any : never : K extends `${number}` ? never : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : never : K extends `${number}` ? never : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : never : K extends `${number}` ? never : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : never : K extends `${number}` ? never : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : never : K extends `${number}` ? never : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : never : K extends `${number}` ? never : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : never : K extends `${number}` ? never : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : never : K extends `${number}` ? never : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : never : K extends `${number}` ? never : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : never : K extends `${number}` ? never : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : never : K extends `${number}` ? never : never : TFieldName extends string | number | symbol ? any : TFieldName extends `${number}` ? unknown : never, options?: Partial<{ shouldValidate: boolean; shouldDirty: boolean; shouldTouch: boolean; }> | undefined): void {
                                throw new Error('Function not implemented.');
                            },
                            trigger: function (name?: string | string[] | readonly string[] | undefined, options?: Partial<{ shouldFocus: boolean; }> | undefined): Promise<boolean> {
                                throw new Error('Function not implemented.');
                            },
                            formState: {
                                isDirty: false,
                                isLoading: false,
                                isSubmitted: false,
                                isSubmitSuccessful: false,
                                isSubmitting: false,
                                isValidating: false,
                                isValid: false,
                                disabled: false,
                                submitCount: 0,
                                defaultValues: undefined,
                                dirtyFields: undefined,
                                touchedFields: undefined,
                                validatingFields: undefined,
                                errors: undefined
                            },
                            resetField: function <TFieldName extends string = string>(name: TFieldName, options?: Partial<{ keepDirty: boolean; keepTouched: boolean; keepError: boolean; defaultValue: TFieldName extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends string ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends string ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends string ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends string ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends string ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends string ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends string ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends string ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends string ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends string ? R extends `${infer K}.${infer R}` ? K extends string | number | symbol ? R extends string ? any : never : K extends `${number}` ? never : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : never : K extends `${number}` ? never : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : never : K extends `${number}` ? never : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : never : K extends `${number}` ? never : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : never : K extends `${number}` ? never : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : never : K extends `${number}` ? never : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : never : K extends `${number}` ? never : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : never : K extends `${number}` ? never : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : never : K extends `${number}` ? never : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : never : K extends `${number}` ? never : never : R extends string | number | symbol ? any : R extends `${number}` ? unknown : never : never : K extends `${number}` ? never : never : TFieldName extends string | number | symbol ? any : TFieldName extends `${number}` ? unknown : never; }> | undefined): void {
                                throw new Error('Function not implemented.');
                            },
                            reset: function (values?: any, keepStateOptions?: Partial<{ keepDirtyValues: boolean; keepErrors: boolean; keepDirty: boolean; keepValues: boolean; keepDefaultValues: boolean; keepIsSubmitted: boolean; keepIsSubmitSuccessful: boolean; keepTouched: boolean; keepIsValidating: boolean; keepIsValid: boolean; keepSubmitCount: boolean; }> | undefined): void {
                                throw new Error('Function not implemented.');
                            },
                            handleSubmit: function (onValid: SubmitHandler<any>, onInvalid?: SubmitErrorHandler<any> | undefined): (e?: React.BaseSyntheticEvent) => Promise<void> {
                                throw new Error('Function not implemented.');
                            },
                            unregister: function (name?: string | string[] | readonly string[] | undefined, options?: (Omit<Partial<{ keepDirtyValues: boolean; keepErrors: boolean; keepDirty: boolean; keepValues: boolean; keepDefaultValues: boolean; keepIsSubmitted: boolean; keepIsSubmitSuccessful: boolean; keepTouched: boolean; keepIsValidating: boolean; keepIsValid: boolean; keepSubmitCount: boolean; }>, 'keepIsSubmitted' | 'keepSubmitCount' | 'keepValues' | 'keepDefaultValues' | 'keepErrors'> & { keepValue?: boolean; keepDefaultValue?: boolean; keepError?: boolean; }) | undefined): void {
                                throw new Error('Function not implemented.');
                            },
                            control: {
                                _subjects: {
                                    values: undefined,
                                    array: undefined,
                                    state: undefined
                                },
                                _removeUnmounted: function (): void {
                                    throw new Error('Function not implemented.');
                                },
                                _names: {
                                    mount: undefined,
                                    unMount: undefined,
                                    array: undefined,
                                    watch: undefined,
                                    focus: undefined,
                                    watchAll: undefined
                                },
                                _state: {
                                    mount: false,
                                    action: false,
                                    watch: false
                                },
                                _reset: function (values?: any, keepStateOptions?: Partial<{ keepDirtyValues: boolean; keepErrors: boolean; keepDirty: boolean; keepValues: boolean; keepDefaultValues: boolean; keepIsSubmitted: boolean; keepIsSubmitSuccessful: boolean; keepTouched: boolean; keepIsValidating: boolean; keepIsValid: boolean; keepSubmitCount: boolean; }> | undefined): void {
                                    throw new Error('Function not implemented.');
                                },
                                _options: undefined,
                                _getDirty: function <TName extends InternalFieldName, TData>(name?: TName, data?: TData): boolean {
                                    throw new Error('Function not implemented.');
                                },
                                _resetDefaultValues: function (): void {
                                    throw new Error('Function not implemented.');
                                },
                                _formState: {
                                    isDirty: false,
                                    isLoading: false,
                                    isSubmitted: false,
                                    isSubmitSuccessful: false,
                                    isSubmitting: false,
                                    isValidating: false,
                                    isValid: false,
                                    disabled: false,
                                    submitCount: 0,
                                    defaultValues: undefined,
                                    dirtyFields: undefined,
                                    touchedFields: undefined,
                                    validatingFields: undefined,
                                    errors: undefined
                                },
                                _updateValid: function (shouldUpdateValid?: boolean): void {
                                    throw new Error('Function not implemented.');
                                },
                                _updateFormState: function (formState: Partial<FormState<any>>): void {
                                    throw new Error('Function not implemented.');
                                },
                                _fields: undefined,
                                _formValues: undefined,
                                _proxyFormState: undefined,
                                _defaultValues: undefined,
                                _getWatch: function (fieldNames?: InternalFieldName | InternalFieldName[], defaultValue?: any, isMounted?: boolean, isGlobal?: boolean) {
                                    throw new Error('Function not implemented.');
                                },
                                _updateFieldArray: function <T extends Function, TFieldValues extends FieldValues, TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>>(name: InternalFieldName, updatedFieldArrayValues?: Partial<FieldArray<TFieldValues, TFieldArrayName>>[], method?: T, args?: Partial<{ argA: unknown; argB: unknown; }>, shouldSetValue?: boolean, shouldUpdateFieldsAndErrors?: boolean): void {
                                    throw new Error('Function not implemented.');
                                },
                                _getFieldArray: function <TFieldArrayValues>(name: InternalFieldName): Partial<TFieldArrayValues>[] {
                                    throw new Error('Function not implemented.');
                                },
                                _setErrors: function (errors: FieldErrors<any>): void {
                                    throw new Error('Function not implemented.');
                                },
                                _updateDisabledField: function (props: { disabled?: boolean; name: FieldName<any>; value?: unknown; } & ({ field?: Field; fields?: undefined; } | { field?: undefined; fields?: FieldRefs; })): void {
                                    throw new Error('Function not implemented.');
                                },
                                _executeSchema: function (names: InternalFieldName[]): Promise<{ errors: FieldErrors; }> {
                                    throw new Error('Function not implemented.');
                                },
                                register: function <TFieldName extends string = string>(name: TFieldName, options?: RegisterOptions<any, TFieldName> | undefined): UseFormRegisterReturn<TFieldName> {
                                    throw new Error('Function not implemented.');
                                },
                                handleSubmit: function (onValid: SubmitHandler<any>, onInvalid?: SubmitErrorHandler<any> | undefined): (e?: React.BaseSyntheticEvent) => Promise<void> {
                                    throw new Error('Function not implemented.');
                                },
                                _disableForm: function (disabled?: boolean): void {
                                    throw new Error('Function not implemented.');
                                },
                                unregister: function (name?: string | string[] | readonly string[] | undefined, options?: (Omit<Partial<{ keepDirtyValues: boolean; keepErrors: boolean; keepDirty: boolean; keepValues: boolean; keepDefaultValues: boolean; keepIsSubmitted: boolean; keepIsSubmitSuccessful: boolean; keepTouched: boolean; keepIsValidating: boolean; keepIsValid: boolean; keepSubmitCount: boolean; }>, 'keepIsSubmitted' | 'keepSubmitCount' | 'keepValues' | 'keepDefaultValues' | 'keepErrors'> & { keepValue?: boolean; keepDefaultValue?: boolean; keepError?: boolean; }) | undefined): void {
                                    throw new Error('Function not implemented.');
                                },
                                getFieldState: function <TFieldName extends string>(name: TFieldName, formState?: FormState<any> | undefined): { invalid: boolean; isDirty: boolean; isTouched: boolean; isValidating: boolean; error?: FieldError; } {
                                    throw new Error('Function not implemented.');
                                },
                                setError: function (name: string, error: ErrorOption, options?: { shouldFocus: boolean; }): void {
                                    throw new Error('Function not implemented.');
                                }
                            },
                            register: function <TFieldName extends string = string>(name: TFieldName, options?: RegisterOptions<any, TFieldName> | undefined): UseFormRegisterReturn<TFieldName> {
                                throw new Error('Function not implemented.');
                            },
                            setFocus: function <TFieldName extends string = string>(name: TFieldName, options?: Partial<{ shouldSelect: boolean; }> | undefined): void {
                                throw new Error('Function not implemented.');
                            }
                        }} {...form}>
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