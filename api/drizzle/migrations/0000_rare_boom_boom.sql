CREATE TABLE `property` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uid` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`first_name_kana` text NOT NULL,
	`last_name_kana` text NOT NULL,
	`graduation_year` integer NOT NULL,
	`slack_name` text NOT NULL,
	`icon_url` text NOT NULL,
	`birthdate` text NOT NULL,
	`gender` text NOT NULL,
	`phone_number` text NOT NULL,
	`email` text NOT NULL,
	`cuurent_postal_code` text NOT NULL,
	`current_address` text NOT NULL,
	`home_postal_code` text NOT NULL,
	`home_address` text NOT NULL,
	`type` text NOT NULL,
	`student_number` text,
	`position` text,
	`grade` text,
	`old_position` text,
	`pld_student_number` text,
	`employment` text,
	`school` text,
	`organization` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `member` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uid` text NOT NULL,
	`is_approved` integer NOT NULL,
	`approve_by` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE TABLE `officer` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uid` text NOT NULL,
	`approved_by` integer NOT NULL,
	`created_at` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE TABLE `payment` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uid` text NOT NULL,
	`payee` integer NOT NULL,
	`is_confirmed` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stack` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uid` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer NOT NULL,
	`deleted_at` integer
);
