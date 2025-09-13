CREATE TABLE `userProfiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`full_name` text NOT NULL,
	`avatar_url` text,
	`phone` text,
	`address` text,
	`city` text,
	`state` text,
	`pincode` text,
	`updated_at` text,
	`email_notifications` text,
	`bio` text,
	`user_login_info` text,
	`email` text NOT NULL,
	`reviews` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `userProfiles_uuid_unique` ON `userProfiles` (`uuid`);--> statement-breakpoint
DROP TABLE `user_profile`;