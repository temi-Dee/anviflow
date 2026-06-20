ALTER TABLE "payslips" ADD COLUMN "position" varchar(100);--> statement-breakpoint
ALTER TABLE "payslips" ADD COLUMN "location" varchar(100);--> statement-breakpoint
ALTER TABLE "payslips" ADD COLUMN "days_worked" varchar(50);--> statement-breakpoint
ALTER TABLE "payslips" ADD COLUMN "bank_details" varchar(255);--> statement-breakpoint
ALTER TABLE "payslips" ADD COLUMN "housing_allowance" numeric(12, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "payslips" ADD COLUMN "transportation_allowance" numeric(12, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "payslips" ADD COLUMN "other_sundry_allowance" numeric(12, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "payslips" ADD COLUMN "leave_allowance" numeric(12, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "payslips" ADD COLUMN "overtime" numeric(12, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "payslips" ADD COLUMN "loan" numeric(12, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "payslips" ADD COLUMN "pension_contribution" numeric(12, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "payslips" ADD COLUMN "nhf" numeric(12, 2) DEFAULT '0';