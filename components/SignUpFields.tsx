'use client'

import React from 'react';
import CustomInput from "./CustomInput";
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { authFormSchema } from '@/lib/utils';

type SignUpFieldsProps = {
  form: UseFormReturn<z.infer<ReturnType<typeof authFormSchema>>>;
};

const SignUpFields: React.FC<SignUpFieldsProps> = ({ form }) => (
  <>
    <div className='flex gap-4'>
      <CustomInput
        control={form.control}
        name='firstName'
        label='First Name'
        placeholder='First Name'
        type='text'
      />
      <CustomInput
        control={form.control}
        name='lastName'
        label='Last Name'
        placeholder='Last Name'
        type='text'
      />
    </div>
    <div className='flex gap-4'>
      <CustomInput
        control={form.control}
        name='businessName'
        label='Business Name'
        placeholder='Business Name'
        type='text'
      />
      <CustomInput
        control={form.control}
        name='state'
        label='Business State'
        placeholder='Business State'
        type='text'
      />
    </div>
    <div className='flex gap-4'>
      <CustomInput
        control={form.control}
        name='address'
        label='Business Address'
        placeholder='Business Address'
        type='text'
      />
      <CustomInput
        control={form.control}
        name='businessRegDate'
        label='Business Reg Date'
        placeholder='Business Reg Date'
        type='date'
      />
    </div>
    <div className='flex gap-4'>
      <CustomInput
        control={form.control}
        name='phone'
        label='Phone Number'
        placeholder='ex. +2341234567890'
        type='tel'
      />
      <CustomInput
        control={form.control}
        name='identificationNo'
        label='ID Number'
        placeholder='BVN'
        type='text'
      />
    </div>
  </>
);

export default SignUpFields;
