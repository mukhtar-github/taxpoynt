import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import CustomInput from './CustomInput';
import { authFormSchema } from 'lib/utils';

type SignInFieldsProps = {
  form: UseFormReturn<z.infer<ReturnType<typeof authFormSchema>>>;
};

const SignInFields: React.FC<SignInFieldsProps> = ({ form }) => {
  return (
    <>
      <div className='flex gap-4'>
        <CustomInput
          control={form.control}
          name='email'
          label='Email'
          placeholder='Enter your email'
          type='email'
        />
        <CustomInput
          control={form.control}
          name='password'
          label='Password'
          placeholder='Enter your password'
          type='password'
        />
      </div>
    </>
  );
};

export default SignInFields;
