import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import { calculateIncomeTax } from '@/lib/utils';

interface TaxReturnDocumentProps {
  income: string;
}

const TaxReturnDocument: React.FC<TaxReturnDocumentProps> = ({ income }) => (
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

export default TaxReturnDocument;