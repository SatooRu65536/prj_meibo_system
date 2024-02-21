import { z } from 'zod';

const KANA_REGEX = /^[ァ-ンー]+$/;
const STUDENT_NUMBER_REGEXP = /^[a-z]\d{5}$/;
const EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PHONE_NUMBER_REGEXP = /^\d{2,4}-\d{2,4}-\d{2,4}$/;
const POSTAL_CODE_REGEXP = /^\d{3}-\d{4}$/;

// ユーザー登録のバリデーション(ベース)
const createUserBaseSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  firstNameKana: z.string().regex(KANA_REGEX, 'カタカナで入力してください'),
  lastNameKana: z.string().regex(KANA_REGEX, 'カタカナで入力してください'),
  skills: z.array(z.string()),
  graduationYear: z.number().min(1900).max(3000),
  slackName: z.string(),
  iconUrl: z.string().url(),
  privateInfo: z.object({
    birthdate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DDで入力してください'),
    gender: z.string(),
    phoneNumber: z
      .string()
      .regex(PHONE_NUMBER_REGEXP, '10桁または11桁の数字で入力してください'),
    email: z
      .string()
      .regex(EMAIL_REGEXP, 'メールアドレスの形式で入力してください'),
    currentAddress: z.object({
      postalCode: z
        .string()
        .regex(
          POSTAL_CODE_REGEXP,
          '郵便番号はの xxx-xxxx の形式で入力してください',
        ),
      address: z.string(),
    }),
    homeAddress: z.object({
      postalCode: z
        .string()
        .regex(POSTAL_CODE_REGEXP, '郵便番号の形式で入力してください'),
      address: z.string(),
    }),
  }),
});

// ユーザー登録のバリデーション(現役生)
const createActiveUserSchema = createUserBaseSchema.extend({
  type: z.literal('active'),
  studentNumber: z
    .string()
    .regex(STUDENT_NUMBER_REGEXP, '英数字1文字+数字6桁で入力してください'),
  position: z.string(),
  grade: z.enum(['B1', 'B2', 'B3', 'B4', 'M1', 'M2', 'D1', 'D2', 'その他']),
});

// ユーザー登録のバリデーション(OB/OG)
const createObogUserSchema = createUserBaseSchema.extend({
  type: z.literal('obog'),
  oldPosition: z.string(),
  oldStudentNumber: z.string(),
  employment: z.string(),
});

// ユーザー登録のバリデーション(外部)
const createExternalUserSchema = createUserBaseSchema.extend({
  type: z.literal('external'),
  school: z.string(),
  organization: z.string(),
});

/**
 * ユーザー登録のバリデーション
 * @private
 */
export const userSchema = z.object({
  user: z.union([
    createActiveUserSchema,
    createObogUserSchema,
    createExternalUserSchema,
  ]),
});

export const createUserSchema = userSchema.extend({
  payeeId: z.number(),
});

/**
 * ユーザーの型
 * @private
 */
export type UserSchema = z.infer<typeof userSchema>;
export type CreateUserSchema = z.infer<typeof createUserSchema>;
