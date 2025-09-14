--> statement-breakpoint
CREATE TABLE `supplyChainEntries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_uuid` text NOT NULL,
	`organization_name` text NOT NULL,
	`userRole` text NOT NULL,
	`organizationID` text NOT NULL,
	`vendors` text,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` text,
	`details` text,
	FOREIGN KEY (`user_uuid`) REFERENCES `userProfiles`(`uuid`) ON UPDATE cascade ON DELETE cascade
);
