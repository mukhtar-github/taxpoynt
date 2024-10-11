'use client'

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from 'components/ui/input';
import { Button } from 'components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from 'components/ui/form';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import TaxReturnDocument from './TaxReturnDocument';
import { BlobProvider } from '@react-pdf/renderer';

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

// Define schema and type
const formSchema = z.object({
  income: z.string().min(1, 'Income is required').refine((val) => !isNaN(Number(val)), {
    message: 'Income must be a valid number',
  }),
});

type FormValues = z.infer<typeof formSchema>;

const TaxForm = () => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { income: '' },
    });

    const income = form.watch("income");

    const onSubmit = async (data: FormValues) => {
        try {
            // Submit form data (replace with actual API call)
            console.log(data);
            toast.success('Tax form submitted successfully');
        } catch (error) {
            console.error('Error submitting tax form:', error);
            toast.error('Failed to submit tax form. Please try again.');
        }
    };
    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
                control={form.control}
                name="income"
                render={({ field }: { field: any }) => (
                    <FormItem>
                        <FormLabel>Income</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter your annual income" {...field} />
                        </FormControl>
                        <FormDescription>
                            Please enter your annual income.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="flex space-x-4">
                <Button type="submit">Submit</Button>
                <BlobProvider document={<TaxReturnDocument income={income} />}>
                    {({ loading }) => (
                        loading ? <div>Loading...</div> : <span>Document Ready</span>
                    )}
                </BlobProvider>
            </div>
        </form>
    );
};

export default TaxForm;