"use client"
// This is a file that allows users to create and manage their own reminders
import React, { useState, useEffect } from 'react';
import { getUserReminders, createUserReminder, deleteUserReminder } from '@/lib/actions/tax.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';

const UserReminders = ({ userId }: { userId: string }) => {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({ title: '', description: '', dueDate: '', priority: 'medium' });

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    const fetchedReminders = await getUserReminders(userId);
    setReminders(fetchedReminders as React.SetStateAction<never[]>);
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    await createUserReminder(userId, {
      ...newReminder,
      priority: newReminder.priority as "high" | "medium" | "low"
    });
    setNewReminder({ title: '', description: '', dueDate: '', priority: 'medium' });
    fetchReminders();
  };

  const handleDeleteReminder = async (id: string) => {
    await deleteUserReminder(id);
    fetchReminders();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Create Personal Reminder</h2>
        <form onSubmit={handleCreateReminder} className="space-y-4">
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
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Reminders</h2>
        {reminders.map((reminder: any) => (
          <div key={reminder.$id} className="border p-4 mb-2 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{reminder.title}</h3>
              <p>{reminder.description}</p>
              <p>Due: {reminder.dueDate}</p>
            </div>
            <Button onClick={() => handleDeleteReminder(reminder.$id)} variant="destructive">Delete</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserReminders;