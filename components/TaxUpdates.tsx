"use client"

import { fetchTaxUpdates } from '@/lib/server';
import React, { useState, useEffect } from 'react';

const TaxUpdates = () => {
  const [updates, setUpdates] = useState<TaxUpdate[]>([]);

  useEffect(() => {
    const getUpdates = async () => {
      try {
        const fetchedUpdates = await fetchTaxUpdates();
        setUpdates(fetchedUpdates);
      } catch (error) {
        console.error('Error fetching tax updates:', error);
      }
    };

    getUpdates();
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Tax Updates</h2>
      {updates.length === 0 ? (
        <p>No tax updates available at the moment.</p>
      ) : (
        <ul className="space-y-4">
          {updates.map((update) => (
            <li key={update.$id} className="border p-4 rounded-md">
              <h3 className="font-semibold">{update.title}</h3>
              <p className="text-sm text-gray-600">{update.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                Category: {update.category} | Date: {new Date(update.date).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaxUpdates;