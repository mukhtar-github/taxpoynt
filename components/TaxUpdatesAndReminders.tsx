"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { useUser } from 'hooks/useUser';
import { TaxUpdate, TaxReminder } from '@/types';
import toast from 'react-hot-toast';
import { fetchTaxUpdatesAndReminders } from 'lib/server';

const TaxUpdatesAndReminders: React.FC = () => {
    const [updates, setUpdates] = useState<TaxUpdate[]>([]);
    const [generalReminders, setGeneralReminders] = useState<TaxReminder[]>([]);
    const user = useUser();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchTaxUpdatesAndReminders();
                setUpdates(data.updates);
                setGeneralReminders(data.reminders);
            } catch (error) {
                console.error('Error fetching tax updates and reminders:', error);
                toast.error('Failed to fetch tax updates and reminders');
            }
        };

        fetchData();
    }, [user]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tax Updates and Reminders</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto">
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
                                {generalReminders.map((reminder: TaxReminder) => (
                                    <li key={reminder.id}>
                                        <p className="font-medium">{reminder.title}</p>
                                        <p className="text-sm text-gray-600">{reminder.description}</p>
                                        <p className="text-xs text-gray-500">Due: {new Date(reminder.dueDate).toLocaleDateString()}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TaxUpdatesAndReminders;