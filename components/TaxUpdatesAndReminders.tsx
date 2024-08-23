"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTaxReminders, getTaxUpdates, getUserReminders } from '@/lib/actions/tax.actions';
import { Button } from '@/components/ui/button';

const TaxUpdatesAndReminders: React.FC<TaxUpdatesAndRemindersProps> = ({ userId }) => {
  const [updates, setUpdates] = useState<TaxUpdate[]>([]);
  const [generalReminders, setGeneralReminders] = useState<Reminder[]>([]);
  const [userReminders, setUserReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const taxUpdates = await getTaxUpdates();
      const taxReminders = await getTaxReminders();
      const userSpecificReminders = await getUserReminders(userId);
      setUpdates(taxUpdates);
      setGeneralReminders(taxReminders);
      setUserReminders(userSpecificReminders);
    };
    fetchData();
  }, [userId]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tax Updates and Reminders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Tax Updates</h3>
            {updates.length === 0 ? (
              <p>No tax updates available at the moment.</p>
            ) : (
              <ul className="list-disc pl-5 space-y-2">
                {updates.map((update: TaxUpdate) => (
                  <li key={update.$id}>
                    <p className="font-medium">{update.title}</p>
                    <p className="text-sm text-gray-600">{update.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">General Reminders</h3>
            {generalReminders.length === 0 ? (
              <p>No general reminders at the moment.</p>
            ) : (
              <ul className="list-disc pl-5 space-y-2">
                {generalReminders.map((reminder: Reminder) => (
                  <li key={reminder.$id}>
                    <p className="font-medium">{reminder.title}</p>
                    <p className="text-sm text-gray-600">{reminder.description}</p>
                    <p className="text-xs text-gray-500">Due: {new Date(reminder.dueDate).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Your Reminders</h3>
            {userReminders.length === 0 ? (
              <p>You have no personal reminders set.</p>
            ) : (
              <ul className="list-disc pl-5 space-y-2">
                {userReminders.map((reminder: Reminder) => (
                  <li key={reminder.$id}>
                    <p className="font-medium">{reminder.title}</p>
                    <p className="text-sm text-gray-600">{reminder.description}</p>
                    <p className="text-xs text-gray-500">Due: {new Date(reminder.dueDate).toLocaleDateString()}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-1"
                      onClick={() => {/* Add function to mark as complete or delete */}}
                    >
                      Mark Complete
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            <Button 
              className="mt-4"
              onClick={() => {/* Add function to create new reminder */}}
            >
              Add New Reminder
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxUpdatesAndReminders;