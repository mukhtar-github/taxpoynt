import React from 'react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface CustomInputProps {
  form: any
  name: string
  label: string
  placeholder: string
}

const CustomInput = ({form, name, label, placeholder}: CustomInputProps) => {
  return (
    <FormField
      control={form.control}
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