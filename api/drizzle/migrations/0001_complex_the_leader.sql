CREATE TABLE `group_member` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`group_id` integer NOT NULL,
	`uid` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `group_name` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `group_name_name_unique` ON `group_name` (`name`);