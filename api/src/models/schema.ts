import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// 共通のテーブル定義
export const memberTable = sqliteTable("member", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  iconUrl: text("icon_url").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  firstNameKana: text("first_name_kana").notNull(),
  lastNameKana: text("last_name_kana").notNull(),
  graduationYear: integer("graduation_year").notNull(),
  birthdate: text("birthdate").notNull(),
  gender: text("gender").notNull(),
  telephone: integer("telephone").notNull(),
  email: text("email").notNull(),
  postCode: integer("post_code").notNull(),
  address: text("address").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
  type: text("type").notNull(),
});

// 技術スタック
export const stackTable = sqliteTable("stack", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  member_id: integer("member_id").notNull(),
  name: text("name").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

// 現役部員
export const activeMemberTable = sqliteTable("active_member", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  member_id: integer("member_id").notNull(),
  studentNumber: text("student_number").notNull(),
  position: text("position").notNull(),
  createdAt: integer("created_at").notNull(),
});

// OB・OG
export const obogTable = sqliteTable("obog", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  member_id: integer("member_id").notNull(),
  studentNumber: text("student_number").notNull(),
  employment: text("employment"),
  oldPosition: text("old_position").notNull(),
});

// 外部
export const externalTable = sqliteTable("external", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  member_id: integer("member_id").notNull(),
  schoolName: text("school_name").notNull(),
  organization: text("organization").notNull(),
});

// 部費の支払い
export const paymentTable = sqliteTable("payment", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  member_id: integer("member_id").notNull(),
  payee: text("payee").notNull(),
  isConfirmed: integer("is_confirmed").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});
