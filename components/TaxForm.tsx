'use client'

import React from 'react';
import { useForm } from 'react-hook-form';
import { PDFDownloadLink, Page, Text, View, Document } from '@react-pdf/renderer';
import { calculateIncomeTax } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage
} from '@/components/ui/form';
import toast from 'react-hot-toast';

const TaxForm = () => {
    const form = useForm({
        defaultValues: {
            income: '',
        },
    });

    const onSubmit = async (data: any) => {
        try {
            // Submit form data
            console.log(data);
            toast.success('Tax form submitted successfully');
        } catch (error) {
            console.error('Error submitting tax form:', error);
            toast.error('Failed to submit tax form. Please try again.');
        }
    };

    const income = form.watch("income");

    const MyDocument = () => (
        <Document>
            <Page size="A4">
                <View>
                    <Text>Title: Tax Return Form</Text>
                    <Text>Income: {income}</Text>
                    <Text>Calculated Tax: {calculateIncomeTax(Number(income))}</Text>
                </View>
            </Page>
        </Document>
    );

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="income"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Income</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your income" {...field} />
                            </FormControl>
                            <FormDescription>
                                Please enter your annual income.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
                <PDFDownloadLink document={<MyDocument />} fileName="tax-return.pdf">
                    {({ blob, url, loading, error }) => 
                        <Button disabled={loading}>
                            {loading ? 'Loading document...' : 'Download Tax Return'}
                        </Button>
                    }
                </PDFDownloadLink>
            </form>
        </Form>
    );
};

export default TaxForm;