import { useForm } from 'react-hook-form';
import { PDFDownloadLink, Page, Text, View, Document } from '@react-pdf/renderer';
import { calculateIncomeTax } from '@/lib/utils';

const TaxForm = () => {
    const { register, handleSubmit, watch } = useForm();
    const onSubmit = (data: any) => console.log(data);

    const income = watch("income");

    const MyDocument = () => (
        <Document>
            <Page size="A4">
                <View>
                    <Text>Title: Tax Return Form</Text>
                    <Text>Income: {income}</Text>
                    <Text>Calculated Tax: {calculateIncomeTax(income)}</Text>
                </View>
            </Page>
        </Document>
    );

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("income")} placeholder="Enter your income" />
            <button type="submit">Submit</button>
            <PDFDownloadLink document={<MyDocument />} fileName="tax-return.pdf">
                {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
            </PDFDownloadLink>
        </form>
    );
};

export default TaxForm;
