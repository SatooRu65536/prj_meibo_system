CREATE TABLE `active_member` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`member_id` integer NOT NULL,
	`student_number` text NOT NULL,
	`position` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `external` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`member_id` integer NOT NULL,
	`school_name` text NOT NULL,
	`organization` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `member` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`member_id` integer NOT NULL,
	`icon_url` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`first_name_kana` text NOT NULL,
	`last_name_kana` text NOT NULL,
	`graduation_year` integer NOT NULL,
	`birthdate` text NOT NULL,
	`gender` text NOT NULL,
	`telephone` integer NOT NULL,
	`email` text NOT NULL,
	`post_code` integer NOT NULL,
	`address` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`type` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `obog` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`member_id` integer NOT NULL,
	`student_number` text NOT NULL,
	`employment` text,
	`old_position` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `payment` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`member_id` integer NOT NULL,
	`payee` text NOT NULL,
	`is_confirmed` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stack` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`member_id` integer NOT NULL,
	`name` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
