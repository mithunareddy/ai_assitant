import { pgTable, text, integer, timestamp, json, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table (synced with Clerk)
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Medical forms table
export const medicalForms = pgTable('medical_forms', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  gender: text('gender').notNull(),
  weight: text('weight').notNull(),
  height: text('height').notNull(),
  bloodType: text('blood_type'),
  currentComplications: text('current_complications'),
  breakfastDetails: text('breakfast_details'),
  lunchDetails: text('lunch_details'),
  dinnerDetails: text('dinner_details'),
  medications: text('medications'),
  allergies: text('allergies'),
  chronicConditions: text('chronic_conditions'),
  uploadedImages: json('uploaded_images').$type(), // Array of image URLs/base64
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Conversations table
export const conversations = pgTable('conversations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  formId: uuid('form_id').notNull().references(() => medicalForms.id, { onDelete: 'cascade' }),
  title: text('title'), // Auto-generated or user-defined title
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Messages table
export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  conversationId: uuid('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  role: text('role').notNull(), // 'user' or 'assistant'
  content: text('content').notNull(),
  images: json('images').$type(), // Array of image URLs/base64 for user messages
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
  medicalForms: many(medicalForms),
  conversations: many(conversations),
}));

export const medicalFormsRelations = relations(medicalForms, ({ one, many }) => ({
  user: one(users, {
    fields: [medicalForms.userId],
    references: [users.id],
  }),
  conversations: many(conversations),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user: one(users, {
    fields: [conversations.userId],
    references: [users.id],
  }),
  medicalForm: one(medicalForms, {
    fields: [conversations.formId],
    references: [medicalForms.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

// Export types for TypeScript inference (optional but helpful)
export const schema = {
  users,
  medicalForms,
  conversations,
  messages,
};