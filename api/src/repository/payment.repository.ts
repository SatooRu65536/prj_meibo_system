import { CustomContext } from '@/types/context';
import { drizzle } from 'drizzle-orm/d1';
import { paymentTable } from '../models/schema';
import { and, eq } from 'drizzle-orm';
import { PaymentTable } from '@/types/table';

export class PaymentRepository {
  /**
   * 支払い情報を登録する
   * @param c
   */
  static async paid(
    c: CustomContext<'/api/user/:id/payment'>,
    payeeId: number,
    payedUid: string,
  ) {
    const db = drizzle(c.env.DB);
    const now = Date.now();

    const [payment] = await db
      .insert(paymentTable)
      .values({
        uid: payedUid,
        payee: payeeId,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return payment;
  }

  static async confirme(
    c: CustomContext<'/api/user/:id/payment'>,
    payedUid: string,
    isConfirmed: boolean,
  ): Promise<PaymentTable | undefined> {
    const db = drizzle(c.env.DB);
    const now = Date.now();
    const confirmNum = isConfirmed ? 1 : 0;

    const [payment] = await db
      .update(paymentTable)
      .set({
        updatedAt: now,
        isConfirmed: confirmNum,
      })
      .where(
        and(eq(paymentTable.uid, payedUid)),
      )
      .returning();

    return payment;
  }
}
