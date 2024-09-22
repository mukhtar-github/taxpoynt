import { createAdminClient } from '@/lib/appwrite';

// Add this interface at the top of the file
interface TaxReminder {
  title: string;
  description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
}

// This is a file that generates reminders for tax updates
export async function generateReminders() {
  const { database } = await createAdminClient();
  
  try {
    // Fetch all users
    const users = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID!
    );

    for (const user of users.documents) {
      // Generate reminders based on user data
      const reminders = generateUserReminders(user);

      // Save reminders to database
      for (const reminder of reminders) {
        await database.createDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_TAX_REMINDERS_COLLECTION_ID!,
          'unique()',
          {
            userId: user.$id,
            title: reminder.title,
            description: reminder.description,
            dueDate: reminder.dueDate,
            priority: reminder.priority
          }
        );
      }
    }

    console.log('Reminders generated and saved successfully');
  } catch (error) {
    console.error('Error generating reminders:', error);
  }
}

// Update the function signature
function generateUserReminders(user: any): TaxReminder[] {
  const currentDate = new Date();
  const reminders: TaxReminder[] = [];

  if (user.isVATRegistered) {
    reminders.push({
      title: 'VAT Return Due',
      description: 'Your quarterly VAT return is due soon',
      dueDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 3, 1),
      priority: 'high'
    });
  }

  // Add more reminder generation logic as needed

  return reminders;
}