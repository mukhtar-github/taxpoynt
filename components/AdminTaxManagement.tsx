"use client"

// This is a file that allows admins to create and manage tax updates and reminders
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import {
  fetchTaxUpdatesAndReminders,
  createNewTaxUpdate,
  createNewTaxReminder,
  deleteTaxUpdateById,
  deleteTaxReminderById
} from '@/lib/server';


const AdminTaxManagement = () => {
  const [updates, setUpdates] = useState<TaxUpdate[]>([]);
  const [reminders, setReminders] = useState<TaxReminder[]>([]);
  const [newUpdate, setNewUpdate] = useState({ title: '', description: '', category: 'law_change' });
  const [newReminder, setNewReminder] = useState({ title: '', description: '', dueDate: '', priority: 'medium' });

  useEffect(() => {
    fetchUpdatesAndReminders();
  }, []);

  const fetchUpdatesAndReminders = async () => {
    try {
      const { updates: fetchedUpdates, reminders: fetchedReminders } = await fetchTaxUpdatesAndReminders();
      setUpdates(fetchedUpdates);
      setReminders(fetchedReminders);
    } catch (error) {
      console.error('Error fetching updates and reminders:', error);
      toast.error('Failed to fetch updates and reminders');
    }
  };

  const handleCreateUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createNewTaxUpdate(newUpdate as Partial<TaxUpdate>);
      setNewUpdate({ title: '', description: '', category: 'law_change' });
      fetchUpdatesAndReminders();
      toast.success('Tax update created successfully');
    } catch (error) {
      console.error('Error creating tax update:', error);
      toast.error('Failed to create tax update');
    }
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createNewTaxReminder(newReminder as Partial<TaxReminder>);
      setNewReminder({ title: '', description: '', dueDate: '', priority: 'medium' as 'medium' | 'high' | 'low' });
      fetchUpdatesAndReminders();
      toast.success('Tax reminder created successfully');
    } catch (error) {
      console.error('Error creating tax reminder:', error);
      toast.error('Failed to create tax reminder');
    }
  };

  const handleDeleteUpdate = async (id: string) => {
    try {
      await deleteTaxUpdateById(id);
      fetchUpdatesAndReminders();
      toast.success('Tax update deleted successfully');
    } catch (error) {
      console.error('Error deleting tax update:', error);
      toast.error('Failed to delete tax update');
    }
  };

  const handleDeleteReminder = async (id: string) => {
    try {
      await deleteTaxReminderById(id);
      fetchUpdatesAndReminders();
      toast.success('Tax reminder deleted successfully');
    } catch (error) {
      console.error('Error deleting tax reminder:', error);
      toast.error('Failed to delete tax reminder');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Create Tax Update</h2>
        <form onSubmit={handleCreateUpdate} className="space-y-4">
          <Input
            placeholder="Title"
            value={newUpdate.title}
            onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
          />
          <Textarea
            placeholder="Description"
            value={newUpdate.description}
            onChange={(e) => setNewUpdate({ ...newUpdate, description: e.target.value })}
          />
          <Select
            value={newUpdate.category}
            onValueChange={(value) => setNewUpdate({ ...newUpdate, category: value })}
          >
            <option value="law_change">Law Change</option>
            <option value="new_regulation">New Regulation</option>
            <option value="deadline_extension">Deadline Extension</option>
          </Select>
          <Button type="submit">Create Update</Button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Create Tax Reminder</h2>
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
        <h2 className="text-xl font-semibold mb-4">Tax Updates</h2>
        {updates.map((update: any) => (
          <div key={update.$id} className="border p-4 mb-2 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{update.title}</h3>
              <p>{update.description}</p>
            </div>
            <Button onClick={() => handleDeleteUpdate(update.$id)} variant="destructive">Delete</Button>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Tax Reminders</h2>
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

export default AdminTaxManagement;