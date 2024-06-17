CREATE INDEX IF NOT EXISTS "user_idx" ON "sessions" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "username_idx" ON "users" ("username");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "users" ("email");