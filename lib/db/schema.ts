import { pgTable, text, timestamp, boolean, serial, varchar, decimal, integer, date } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- PayslipFlow App Tables ------------------------------------------------

export const employees = pgTable('employees', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  employeeId: varchar('employee_id', { length: 50 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  department: varchar('department', { length: 100 }),
  position: varchar('position', { length: 100 }),
  salary: decimal('salary', { precision: 12, scale: 2 }),
  bankName: varchar('bank_name', { length: 100 }),
  bankAccount: varchar('bank_account', { length: 50 }),
  taxId: varchar('tax_id', { length: 50 }),
  hireDate: date('hire_date'),
  status: varchar('status', { length: 20 }).default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const payrolls = pgTable('payrolls', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  payPeriod: varchar('pay_period', { length: 50 }).notNull(),
  payDate: date('pay_date').notNull(),
  totalEmployees: integer('total_employees').default(0),
  totalAmount: decimal('total_amount', { precision: 15, scale: 2 }).default('0'),
  status: varchar('status', { length: 20 }).default('draft'),
  fileUrl: text('file_url'),
  fileName: varchar('file_name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const payslips = pgTable('payslips', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  payrollId: integer('payroll_id').notNull(),
  employeeId: integer('employee_id').notNull(),
  employeeName: varchar('employee_name', { length: 200 }).notNull(),
  employeeEmail: varchar('employee_email', { length: 255 }).notNull(),
  basicSalary: decimal('basic_salary', { precision: 12, scale: 2 }).default('0'),
  allowances: decimal('allowances', { precision: 12, scale: 2 }).default('0'),
  deductions: decimal('deductions', { precision: 12, scale: 2 }).default('0'),
  tax: decimal('tax', { precision: 12, scale: 2 }).default('0'),
  netSalary: decimal('net_salary', { precision: 12, scale: 2 }).default('0'),
  position: varchar('position', { length: 100 }),
  location: varchar('location', { length: 100 }),
  daysWorked: varchar('days_worked', { length: 50 }),
  bankDetails: varchar('bank_details', { length: 255 }),
  housingAllowance: decimal('housing_allowance', { precision: 12, scale: 2 }).default('0'),
  transportationAllowance: decimal('transportation_allowance', { precision: 12, scale: 2 }).default('0'),
  otherSundryAllowance: decimal('other_sundry_allowance', { precision: 12, scale: 2 }).default('0'),
  leaveAllowance: decimal('leave_allowance', { precision: 12, scale: 2 }).default('0'),
  overtime: decimal('overtime', { precision: 12, scale: 2 }).default('0'),
  loan: decimal('loan', { precision: 12, scale: 2 }).default('0'),
  pensionContribution: decimal('pension_contribution', { precision: 12, scale: 2 }).default('0'),
  nhf: decimal('nhf', { precision: 12, scale: 2 }).default('0'),
  pdfUrl: text('pdf_url'),
  pdfGeneratedAt: timestamp('pdf_generated_at'),
  emailSentAt: timestamp('email_sent_at'),
  emailStatus: varchar('email_status', { length: 20 }).default('pending'),
  emailError: text('email_error'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const emailLogs = pgTable('email_logs', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  payslipId: integer('payslip_id').notNull(),
  recipientEmail: varchar('recipient_email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 500 }),
  status: varchar('status', { length: 20 }).default('pending'),
  sentAt: timestamp('sent_at'),
  openedAt: timestamp('opened_at'),
  errorMessage: text('error_message'),
  resendId: varchar('resend_id', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
})
