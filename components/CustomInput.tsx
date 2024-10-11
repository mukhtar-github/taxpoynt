import React from 'react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form"
import { Input } from "components/ui/input"
import { Controller, Control } from 'react-hook-form';

interface CustomInputProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  type: string;
}

const CustomInput = ({control, name, label, placeholder, type}: CustomInputProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className='form-item'>
          <FormLabel className='form-label'>{label}</FormLabel>
            <div className='flex flex-col w-full'>
              <FormControl>
                <Input
                  {...field}
                  placeholder={placeholder}
                  className='input-class'
                  type={type}
                />
              </FormControl>
              <FormMessage className='form-message mt-2'/>
            </div>
        </div>
      )}
    />
  )
}

export default CustomInput