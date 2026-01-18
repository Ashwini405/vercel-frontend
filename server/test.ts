import pool from "./lib/db.ts";
import type { RowDataPacket } from "mysql2";

interface CountResult extends RowDataPacket {
  total: number;
}

const test = async () => {
  try {
    const [rows] = await pool.query<CountResult[]>(
      "SELECT COUNT(*) AS total FROM products"
    );

    console.log("Total products:", rows[0].total);
    process.exit();
  } catch (err) {
    console.error("DB Error ❌", err);
  }
};

test();
