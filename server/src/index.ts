import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import pg from "pg";
import { pool } from "./db";
const authRoutes = require("./routes/auth"); 
const postRoutes = require("./routes/post");
pool
  .connect()
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log("Error connecting to the database", err);
  });



const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', postRoutes);

// //REGISTER USER ROUTE
// app.post("/api/users/register", async (req: Request, res: Response) => {
//   const { user_id, name, email, password } = req.body;
//   const queryText = `INSERT INTO users (user_id, name, email, password) VALUES ($1, $2, $3, $4) RETURNING *`;
//   const values = [user_id, name, email, password];
//   try {
//     const { rows } = await pool.query(queryText, values);
//     res.send(rows[0]);
//   } catch (err: any) {
//     console.log(err.message);
//     res.sendStatus(500);
//   }
// });

// //LOGIN USER ROUTE
// app.post("/api/users/login", async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   const queryText = `SELECT * FROM users WHERE email = $1 AND password = $2`;
//   const values = [email, password];

//   if (!email || !password) {
//     res.json({
//       message: "Please provide email and password",
//     });
//   }

//   try {
//     const { rows } = await pool.query(queryText, values);
//     if (rows.length > 0) {
//       res.json(rows[0]);
//     } else {
//       res.json({
//         message: "Invalid email or password",
//       });
//     }
//   } catch (err: any) {
//     console.log(err.message);
//     res.sendStatus(500);
//   }
// });

// //FORGOT PASSWORD ROUTE
// app.post("/api/users/forgotpassword", async (req: Request, res: Response) => {
//   const { email } = req.body;
//   const queryText = `SELECT * FROM users WHERE email = $1`;
//   const values = [email];
//   try {
//     const { rows } = await pool.query(queryText, values);
//     res.send(rows[0]);
//   } catch (err: any) {
//     console.log(err.message);
//     res.sendStatus(500);
//   }
// });

// //RESET PASSWORD ROUTE
// app.post("/api/users/resetpassword", async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   const queryText = `UPDATE users SET password = $1 WHERE email = $2`;
//   const values = [password, email];
//   try {
//     const { rows } = await pool.query(queryText, values);
//     res.send(rows[0]);
//   } catch (err: any) {
//     console.log(err.message);
//     res.sendStatus(500);
//   }
// });

const port = parseInt(process.env.PORT || "5000");

app.listen(port, () => console.log(`Listening on port ${port}`));
