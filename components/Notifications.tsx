"use client"

import React, { useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { fetchRecentTaxUpdates } from 'lib/server';
import { TaxUpdate } from 'types';

const Notifications = () => {
  useEffect(() => {
    const checkForNewUpdates = async () => {
      const recentUpdates = await fetchRecentTaxUpdates();

      recentUpdates.forEach((update: TaxUpdate) => {
        toast(`New Tax Update: ${update.title}`, {
          duration: 5000,
          position: 'top-right',
        });
      });
    };

    checkForNewUpdates();
    const interval = setInterval(checkForNewUpdates, 3600000); // Check every hour

    return () => clearInterval(interval);
  }, []);

  return <Toaster />;
};

export default Notifications;