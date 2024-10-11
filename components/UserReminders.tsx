"use client"

import React, { useState, useEffect } from 'react';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Textarea } from 'components/ui/textarea';
import { Select } from 'components/ui/select';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { fetchUserReminders, createNewUserReminder, deleteUserReminderById } from 'lib/server';
import { useUser } from 'hooks/useUser';

const UserReminders = () => {
  const { user, error } = useUser(); // Destructure 'error' from useUser
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({ title: '', description: '', dueDate: '', priority: 'medium' });
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    if (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to load user data');
      setIsLoading(false);
      return;
    }

    if (!user) {
      return;
    }

    fetchReminders();
  }, [user, error]);

  const fetchReminders = async () => {
    try {
      const fetchedReminders = await fetchUserReminders(user.id);
      setReminders(fetchedReminders as React.SetStateAction<never[]>);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      toast.error('Failed to fetch reminders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createNewUserReminder(user.id, {
        ...newReminder,
        priority: newReminder.priority as "high" | "medium" | "low"
      });
      setNewReminder({ title: '', description: '', dueDate: '', priority: 'medium' });
      fetchReminders();
      toast.success('Reminder created successfully');
    } catch (error) {
      console.error('Error creating reminder:', error);
      toast.error('Failed to create reminder');
    }
  };

  const handleDeleteReminder = async (id: string) => {
    try {
      await deleteUserReminderById(id);
      fetchReminders();
      toast.success('Reminder deleted successfully');
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast.error('Failed to delete reminder');
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading user data.</p>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Reminders</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateReminder} className="space-y-4 mb-6">
          <Input
            placeholder="Title"
            value={newReminder.title}
            onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
          />
          <Textarea
            placeholder="Description"
            value={newReminder.description}
            onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
          />
          <Input
            type="date"
            value={newReminder.dueDate}
            onChange={(e) => setNewReminder({ ...newReminder, dueDate: e.target.value })}
          />
          <Select
            value={newReminder.priority}
            onValueChange={(value) => setNewReminder({ ...newReminder, priority: value })}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
          <Button type="submit">Create Reminder</Button>
        </form>

        <div className="space-y-4">
          {reminders.map((reminder: any) => (
            <div key={reminder.$id} className="border p-4 rounded-md flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{reminder.title}</h3>
                <p className="text-sm text-gray-600">{reminder.description}</p>
                <p className="text-xs text-gray-500">Due: {new Date(reminder.dueDate).toLocaleDateString()}</p>
              </div>
              <Button onClick={() => handleDeleteReminder(reminder.$id)} variant="destructive">Delete</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserReminders;