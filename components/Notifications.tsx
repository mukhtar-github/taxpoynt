"use client"

import React, { useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { getTaxUpdates } from '@/lib/actions/tax.actions';

const Notifications = () => {
  useEffect(() => {
    const checkForNewUpdates = async () => {
      const updates = await getTaxUpdates();
      const recentUpdates = updates.filter(
        update => new Date(update.date) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      );

      recentUpdates.forEach(update => {
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