import { ActionArgs, json, LoaderArgs } from "@remix-run/node";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: "postgresql://postgres:pppp@103.150.197.128:5431/db",
});

export const loader = async ({ request }: LoaderArgs) => {
  const client = await pool.connect();
  const { rows } = await client.query("SELECT * FROM config WHERE id=1");
  client.release();
  return json({ bgColor: rows?.[0]?.bg_color || "#141919" });
};

export async function action({ request }: ActionArgs) {
  switch (request.method) {
    case "POST":
      const body = await request.json();
      const bgColor = body?.bgColor;
      const client = await pool.connect();
      await client.query(`UPDATE config SET bg_color='${bgColor}' WHERE id=1`);
      client.release();
      return json({ bgColor: bgColor });

    default:
      break;
  }
}
