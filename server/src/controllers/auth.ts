import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db";
import {
  comparePassword,
  emailVerification,
  hashPassword,
  resetHashPassword,
} from "../helpers/auth";
import sgMail from "@sendgrid/mail";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export const register = async (req: Request, res: Response) => {
  console.log("reg endpoint", req.body);
  const { name, email, password, mobile, city, questions, secret } = req.body;
  const exist = await pool.query(
    `SELECT * FROM users WHERE email = '${email}'`
  );
  if (exist.rows.length > 0) {
    return res.json({
      error: "User already exist",
    });
  }
  try {
    await emailVerification(
      name,
      email,
      password,
      mobile,
      city,
      questions,
      secret
    );
    return res.json({
      message: `Email sent to ${email}`,
    });
  } catch (err: any) {
    console.log(err.message);
    return res.json({
      error: err.message,
    });
  }
};

export const accountActivation = async (req: Request, res: Response) => {
  const { token } = req.body;
  try {
    const validCheck = jwt.verify(
      token,
      process.env.JWT_ACCOUNT_ACTIVATION as string
    );
    const { name, email, password, mobile, city, questions, secret }: any =
      jwt.decode(token);
    const hashedPassword = await hashPassword(password);
    const user = await pool.query(
      `INSERT INTO users (name, email, password, mobile, city, questions, secret,verified) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, email, hashedPassword, mobile, city, questions, secret, true]
    );
    return res.json({
      message: "Signup success. Please signin.",
      user: user.rows[0],
    });
  } catch (err: any) {
    console.log(err.message);
    return res.json({
      error: err.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query(
      `SELECT * FROM users WHERE email = '${email}'`
    );
    if (!user.rows[0]) {
      return res.json({
        error: "User does not exist",
      });
    }
    const match = await comparePassword(password, user.rows[0].password);
    if (!match) {
      return res.json({
        error: "Incorrect password",
      });
    }
    const token = jwt.sign(
      {
        id: user.rows[0].id,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );
    user.rows[0].password = undefined;
    user.rows[0].secret = undefined;
    return res.json({
      message: "Login success",
      token,
      user: user.rows[0],
    });
  } catch (err: any) {
    console.log(err.message);
    return res.json({
      error: err.message,
    });
  }
};

export const currentUser = async (req: Request, res: Response) => {
  try {
    const { id }: any = req.user;
    const user = await pool.query(`SELECT * FROM users WHERE id = '${id}'`);
    return res.json({
      ok: true,
      user: user.rows[0],
    });
  } catch (err: any) {
    console.log(err.message);
    return res.json({
      error: err.message,
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email, questions, secret } = req.body;
  try {
    const user = await pool.query(
      `SELECT * FROM users WHERE email = '${email}'`
    );
    if (!user.rows[0]) {
      return res.json({
        error: "User does not exist",
      });
    }
    if (user.rows[0].questions !== questions) {
      return res.json({
        error: "Incorrect answer",
      });
    }
    if (user.rows[0].secret !== secret) {
      return res.json({
        error: "Incorrect secret",
      });
    }
    const token = jwt.sign(
      {
        id: user.rows[0].id,
      },
      process.env.JWT_RESET_PASSWORD as string,
      {
        expiresIn: "1h",
      }
    );
    const emailData: any = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Forgot password link`,
      html: `
            <h1>Please use the following link to change your password</h1>
            <p>${process.env.CLIENT_URL}/forgot-password/${token}</p>
            <hr/>
            <p>This email may contain sensitive information</p>
            <p>${process.env.CLIENT_URL}</p>
            `,
    };

    sgMail.send(emailData);
    return res.json({
      message: "Email sent to reset password",
    });
  } catch (err: any) {
    console.log(err.message);
    return res.json({
      error: err.message,
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  try {
    const verifyReset = jwt.verify(
      token,
      process.env.JWT_RESET_PASSWORD as string
    );
    if (!verifyReset) {
      return res.json({
        error: "Invalid token",
      });
    }
    const { id }: any = verifyReset;
    const hashedPassword = await resetHashPassword(newPassword);
    const user = await pool.query(
      `UPDATE users SET password = $1 WHERE id = $2 RETURNING *`,
      [hashedPassword, id]
    );
    return res.json({
      message: "Password reset success",
      user: user.rows[0],
    });
  } catch (err: any) {
    console.log(err.message);
    return res.json({
      error: err.message,
    });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID as string);
  const { tokenId } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID as string,
    });
    const payload = ticket.getPayload();
    const { email_verified, name, email }: any = payload;
    console.log(payload);
    if (email_verified) {
      const user = await pool.query(
        `SELECT * FROM users WHERE email = '${email}'`
      );
      if (user.rows[0]) {
        const token = jwt.sign(
          {
            id: user.rows[0].id,
          },
          process.env.JWT_SECRET as string,
          {
            expiresIn: "1h",
          }
        );
        if (token) {
          const { id, name, email } = user.rows[0];
          return res.json({
            token,
            user: { id, name, email },
          });
        }
      }
      let password = email + process.env.JWT_SECRET as string;
      const newUser = await pool.query(
        `INSERT INTO users (name, email, password, mobile, city, questions, secret,verified) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
          name,
          email,
          password,
          "123456789",
          "city",
          "questions",
          "secret",
          true,
        ]
      );
      const token = jwt.sign(
        {
          id: newUser.rows[0].id,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "1h",
        }
      );
      if (token) {
        const { id, name, email } = newUser.rows[0];
        return res.json({
          token,
          user: { id, name, email },
        });
      }
    }
    return res.json({
      error: "Google login failed",
    });
  } catch (err: any) {
    console.log(err);
    return res.json({
      error: err.message,
    });
  }
};

export const facebookLogin = async (req: Request, res: Response) => {
  const { userID, accessToken } = req.body;
  try {
    const result = await axios.get(
      `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`
    );
    if (result.data.error) {
      return res.json({
        error: "Facebook login failed",
      });
    }
    
    const { email, name } = result.data;
    const user = await pool.query(
      `SELECT * FROM users WHERE email = '${email}'`
    );
    if (user.rows[0]) {
      const token = jwt.sign(
        {
          id: user.rows[0].id,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "1h",
        }
      );
      if (token) {
        const { id, name, email } = user.rows[0];
        return res.json({
          token,
          user: { id, name, email },
        });
      }
    }
    let password = (email + process.env.JWT_SECRET) as string;
    const newUser = await pool.query(
      `INSERT INTO users (name, email, password, mobile, city, questions, secret,verified) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, email, password, "123456789", "city", "questions", "secret", true]
    );
    const token = jwt.sign(
      {
        id: newUser.rows[0].id,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );
    if (token) {
      const { id, name, email } = newUser.rows[0];
      return res.json({
        token,
        user: { id, name, email },
      });
    }
  } catch (err: any) {
    console.log(err);
    return res.json({
      error: err.message,
    });
  }
};
