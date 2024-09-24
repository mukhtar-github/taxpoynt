'use client';

import React from 'react';

interface TaxDashboardProps {
  userId: string;
}

const TaxDashboard: React.FC<TaxDashboardProps> = ({ userId }) => {
  // Your component logic here

  return (
    <div>
      {/* Example usage of userId */}
      <h2>User ID: {userId}</h2>
      {/* Render tax dashboard based on userId */}
    </div>
  );
};

export default TaxDashboard;