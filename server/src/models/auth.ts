// import { pool } from "../db";

// export const registerQuery = async (body: any, callback: Function) => {
//   console.log("reg endpoint", body);
//   const { id, name, email, password, mobile, city, questions, secret } = body;
//   const query = `INSERT INTO users (id, name, email, password, mobile, city, questions, secret) VALUES ($1,$2, $3, $4, $5, $6, $7, $8) RETURNING *`;
//   const values = [id, name, email, password, mobile, city, questions, secret];

//   try {
//     const { rows } = await pool.query(query, values);
//     return callback(null, rows[0]);
//   } catch (err: any) {
//     console.log(err.message);
//     return callback(err.message, null);
//   }
// };

// export const accountActivationQuery = async (body: any) => {
//   const { token } = body;
//   try {
//     return token;
//   } catch (error) {
//     return error;
//   }
// };
