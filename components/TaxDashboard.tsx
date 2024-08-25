import React from 'react';
import TaxUpdatesAndReminders from './TaxUpdatesAndReminders';
import TaxPlanner from './TaxPlanner';

const TaxDashboard = () => {
  return (
    <div className="tax-dashboard-container grid grid-cols-1 md:grid-cols-2 gap-6">
      <TaxUpdatesAndReminders />
      <TaxPlanner />
    </div>
  );
};

export default TaxDashboard;