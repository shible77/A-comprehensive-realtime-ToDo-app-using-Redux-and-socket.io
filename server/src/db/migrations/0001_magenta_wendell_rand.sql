CREATE TABLE `otp` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(6) NOT NULL,
	`user_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `otp_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `otp` ADD CONSTRAINT `otp_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;