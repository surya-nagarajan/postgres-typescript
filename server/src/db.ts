
import { Pool } from "pg";


export const pool = new Pool({
    user: "postgres",
    password: "fayezfawaz",
    host: "localhost",
    port: 5432,
    database: "simpleapp"
});