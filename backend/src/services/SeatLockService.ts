import pool from '../config/database';

export interface ISeatLock {
  id?: number;
  trip_id: number;
  seat_id: number;
  user_id: number;
  lock_token: string;
  expires_at: Date;
  is_active?: boolean;
}

export class SeatLockService {
  static async lockSeats(tripId: number, seatIds: number[], userId: number): Promise<string> {
    const lockToken = require('uuid').v4();
    const lockDuration = parseInt(process.env.SEAT_LOCK_DURATION || '15');
    const expiresAt = new Date(Date.now() + lockDuration * 60 * 1000);

    const query = `
      INSERT INTO seat_locks (trip_id, seat_id, user_id, lock_token, expires_at, is_active)
      VALUES ($1, $2, $3, $4, $5, TRUE)
      RETURNING id
    `;

    try {
      for (const seatId of seatIds) {
        // Check if seat is already locked
        const checkQuery = `
          SELECT id FROM seat_locks
          WHERE seat_id = $1 AND trip_id = $2 AND is_active = TRUE AND expires_at > CURRENT_TIMESTAMP
        `;
        const checkResult = await pool.query(checkQuery, [seatId, tripId]);
        if (checkResult.rows.length > 0) {
          throw new Error(`Seat ${seatId} is already locked`);
        }

        await pool.query(query, [tripId, seatId, userId, lockToken, expiresAt]);
      }
      return lockToken;
    } catch (error) {
      throw new Error(`Failed to lock seats: ${(error as Error).message}`);
    }
  }

  static async releaseLocks(lockToken: string) {
    const query = `
      UPDATE seat_locks
      SET is_active = FALSE
      WHERE lock_token = $1
    `;
    await pool.query(query, [lockToken]);
  }

  static async releaseExpiredLocks() {
    const query = `
      UPDATE seat_locks
      SET is_active = FALSE
      WHERE expires_at < CURRENT_TIMESTAMP AND is_active = TRUE
    `;
    await pool.query(query);
  }

  static async validateLock(lockToken: string, tripId: number, seatIds: number[]): Promise<boolean> {
    const query = `
      SELECT COUNT(*) as lock_count
      FROM seat_locks
      WHERE lock_token = $1
        AND trip_id = $2
        AND seat_id = ANY($3)
        AND is_active = TRUE
        AND expires_at > CURRENT_TIMESTAMP
    `;
    const result = await pool.query(query, [lockToken, tripId, seatIds]);
    return parseInt(result.rows[0].lock_count) === seatIds.length;
  }

  static async getLockInfo(lockToken: string) {
    const query = `
      SELECT * FROM seat_locks
      WHERE lock_token = $1 AND is_active = TRUE
      LIMIT 1
    `;
    const result = await pool.query(query, [lockToken]);
    return result.rows[0];
  }
}
