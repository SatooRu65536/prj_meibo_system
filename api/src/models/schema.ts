import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// 共通のテーブル定義
export const memberTable = sqliteTable('member', {
  id: integer('id', { mode: 'number' })
    .notNull()
    .primaryKey({ autoIncrement: true }),
  uid: text('uid').notNull(),
  isApproved: integer('is_approved').notNull(),
  approveBy: integer('approve_by'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
  deletedAt: integer('deleted_at'),
});

// 技術スタック
export const stackTable = sqliteTable('stack', {
  id: integer('id', { mode: 'number' })
    .notNull()
    .primaryKey({ autoIncrement: true }),
  uid: text('uid').notNull(),
  name: text('name').notNull(),
  createdAt: integer('created_at').notNull(),
  deletedAt: integer('deleted_at'),
});

// メンバープロパティ
export const memberPropertyTable = sqliteTable('property', {
  id: integer('id', { mode: 'number' })
    .notNull()
    .primaryKey({ autoIncrement: true }),
  uid: text('uid').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  firstNameKana: text('first_name_kana').notNull(),
  lastNameKana: text('last_name_kana').notNull(),
  graduationYear: integer('graduation_year').notNull(),
  slackName: text('slack_name').notNull(),
  iconUrl: text('icon_url').notNull(),
  birthdate: text('birthdate').notNull(),
  gender: text('gender').notNull(),
  phoneNumber: text('phone_number').notNull(),
  email: text('email').notNull(),
  cuurentPostalCode: text('cuurent_postal_code').notNull(),
  currentAddress: text('current_address').notNull(),
  homePostalCode: text('home_postal_code').notNull(),
  homeAddress: text('home_address').notNull(),

  type: text('type', {
    mode: 'text',
    enum: ['active', 'obog', 'external'],
  }).notNull(),

  // 現役部員
  studentNumber: text('student_number'),
  position: text('position'),
  grade: text('grade', {
    enum: ['B1', 'B2', 'B3', 'B4', 'M1', 'M2', 'D1', 'D2', 'その他'],
  }),

  // OB・OG
  oldPosition: text('old_position'),
  oldStudentNumber: text('pld_student_number'),
  employment: text('employment'),

  // 外部
  school: text('school'),
  organization: text('organization'),

  createdAt: integer('created_at').notNull(),
});

// 役員
export const officerTable = sqliteTable('officer', {
  id: integer('id', { mode: 'number' })
    .notNull()
    .primaryKey({ autoIncrement: true }),
  uid: text('uid').notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
  deletedAt: integer('deleted_at'),
});

// 部費の支払い
export const paymentTable = sqliteTable('payment', {
  id: integer('id', { mode: 'number' })
    .notNull()
    .primaryKey({ autoIncrement: true }),
  uid: text('uid').notNull(),
  payee: text('payee').notNull(), // お金を受け取った人
  isConfirmed: integer('is_confirmed').notNull().default(0), // 会計が確認したか
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});
