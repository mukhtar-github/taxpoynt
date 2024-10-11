"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Controller, FormProvider, Path, useFormContext, UseFormReturn } from "react-hook-form"
import { ControllerProps, FieldValues } from "react-hook-form"

import { cn } from "lib/utils"
import { Label } from "components/ui/label"

const Form = React.forwardRef<HTMLFormElement, React.FormHTMLAttributes<HTMLFormElement> & { form: UseFormReturn<any> }>(
  ({ form, className, ...props }, ref) => (
    <FormProvider {...form}>
      <form ref={ref} className={className} {...props}>
        {props.children}
      </form>
    </FormProvider>
  )
)
Form.displayName = "Form"

// Removed redundant FormField definition if exists

const FormFieldContext = React.createContext<{ name: string } | undefined>(undefined)
const FormItemContext = React.createContext<{ id: string } | undefined>(undefined)

const FormField = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends Path<TFieldValues> = Path<TFieldValues>
  >({ ...props }: ControllerProps<TFieldValues, TName>) => {
    return (
      <FormFieldContext.Provider value={{ name: props.name }}>
        <Controller {...props} />
      </FormFieldContext.Provider>
    )
  }

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <FormItemContext.Provider value={{ id: props.id || "" }}>
        <div ref={ref} className={cn("space-y-2", className)} {...props} />
      </FormItemContext.Provider>
    )
  }
)
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  const { formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      htmlFor={formItemId}
      className={cn(
        "block text-sm font-medium",
        className
      )}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { formItemId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { formMessageId } = useFormField()
  const body = children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = fieldContext ? getFieldState(fieldContext.name, formState) : {}

  return {
    id: itemContext?.id,
    name: fieldContext?.name,
    formItemId: itemContext?.id ? `${itemContext.id}-form-item` : undefined,
    formDescriptionId: itemContext?.id ? `${itemContext.id}-form-item-description` : undefined,
    formMessageId: itemContext?.id ? `${itemContext.id}-form-item-message` : undefined,
    ...fieldState,
  }
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormFieldContext,
  FormItemContext,
}
