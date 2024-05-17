import { pgTable, text, timestamp, pgEnum, index } from 'drizzle-orm/pg-core';
import { AuthProvider } from '../../config/auth.config';

export const userAuthProviderEnum = pgEnum('provider', AuthProvider);

export const users = pgTable(
  'users',
  {
    id: text('id').primaryKey().notNull(),
    username: text('username').unique().notNull(),
    email: text('email').unique().notNull(),
    image: text('image'),
    authProvider: userAuthProviderEnum('auth_provider').notNull(),
    createdAt: timestamp('created_at', {
      mode: 'date',
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', {
      mode: 'date',
      withTimezone: true,
    }).notNull(),
  },
  (table) => {
    return {
      usernameIdx: index('username_idx').on(table.username),
      emailIdx: index('email_idx').on(table.email),
    };
  }
);

export const sessions = pgTable(
  'sessions',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at', {
      withTimezone: true,
      mode: 'date',
    }).notNull(),
    createdAt: timestamp('created_at', {
      mode: 'date',
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      userIdx: index('user_idx').on(table.userId),
    };
  }
);
