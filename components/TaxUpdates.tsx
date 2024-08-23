"use client"

import React, { useState, useEffect } from 'react';

const TaxUpdates = () => {
  const [updates, setUpdates] = useState<TaxUpdate[]>([]);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await fetch('/api/tax-updates');
        if (!response.ok) {
          throw new Error('Failed to fetch tax updates');
        }
        const data = await response.json();
        setUpdates(data);
      } catch (error) {
        console.error('Error fetching tax updates:', error);
      }
    };

    fetchUpdates();
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