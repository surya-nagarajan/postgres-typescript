import express, { Request, Response } from "express";
import { pool } from "../db";

export const createPost = async (req: Request, res: Response) => {
  const {
    name,
    email,
    mobile,
    country,
    region,
    city,
    address,
    department,
    education,
    aadhar,
    pan,
    prvCompany,
  }: any = req.body;
  if (!name.length) {
    return res.json({
      error: "Name is required",
    });
  }
  if (!email.length) {
    return res.json({
      error: "Email is required",
    });
  }
  if (!mobile.length) {
    return res.json({
      error: "Mobile is required",
    });
  }
  if (!country.length) {
    return res.json({
      error: "Country is required",
    });
  }
  if (!region.length) {
    return res.json({
      error: "Region is required",
    });
  }
  if (!city.length) {
    return res.json({
      error: "City is required",
    });
  }
  if (!address.length) {
    return res.json({
      error: "Address is required",
    });
  }
  if (!department.length) {
    return res.json({
      error: "Department is required",
    });
  }
  if (!education.length) {
    return res.json({
      error: "Education is required",
    });
  }
  if (!aadhar.length) {
    return res.json({
      error: "Aadhar is required",
    });
  }
  if (!pan.length) {
    return res.json({
      error: "PAN is required",
    });
  }
  if (!prvCompany.length) {
    return res.json({
      error: "Previous Company is required",
    });
  }

  const { id }: any = req.user;
  try {
    const Posts = await pool.query(
      `INSERT INTO posts (emp_name, emp_email, emp_mobile, emp_country, emp_region, emp_city, emp_address, emp_department, emp_education, emp_aadhar, emp_pan, emp_prvCompany,postedBy) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,$13) RETURNING *`,
      [
        name,
        email,
        mobile,
        country,
        region,
        city,
        address,
        department,
        education,
        aadhar,
        pan,
        prvCompany,
        id,
      ]
    );
    return res.json({
      message: "Post created successfully",
      data: Posts.rows[0],
    });
  } catch (err: any) {
    console.log(err);
    return res.json({
      error: err.message,
    });
  }
};

export const userPost = async (req: Request, res: Response) => {
try {
    const { id }: any = req.params;
    console.log("Hi id", id);
    const Post = await pool.query(
        `SELECT * FROM posts WHERE post_id = $1`,
        [id]
        );
      return res.json(Post.rows[0]);
} catch (err:any) {
    console.log(err);
    return res.json({
        error: err.message,
    });
}
}



export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id }: any = req.params;
    const {
      name,
      email,
      mobile,
      country,
      region,
      city,
      address,
      department,
      education,
      aadhar,
      pan,
      prvCompany,
    }: any = req.body;
    const Posts = await pool.query(
      `UPDATE posts SET emp_name=$1, emp_email=$2, emp_mobile=$3, emp_country=$4, emp_region=$5, emp_city=$6, emp_address=$7, emp_department=$8, emp_education=$9, emp_aadhar=$10, emp_pan=$11, emp_prvCompany=$12 WHERE post_id=$13 RETURNING *`,
      [
        name,
        email,
        mobile,
        country,
        region,
        city,
        address,
        department,
        education,
        aadhar,
        pan,
        prvCompany,
        id,
      ]
    );
    return res.json(Posts.rows);
  } catch (err: any) {
    console.log(err);
    return res.json({
      error: err.message,
    });
  }
};

export const deletePost = async (req: Request, res: Response) => {
    try {
        const { id }: any = req.params;
        const Posts = await pool.query(
        `DELETE FROM posts WHERE post_id=$1 RETURNING *`,
        [id]
        );
        return res.json(Posts.rows);
    } catch (err: any) {
        console.log(err);
        return res.json({
        error: err.message,
        });
    }
}

export const postByUser = async (req: Request, res: Response) => {
  const { id }: any = req.user;
  try {
    const Posts = await pool.query(`SELECT * FROM posts WHERE postedby = $1`, [
      id,
    ]);
    return res.json(Posts.rows);
  } catch (err: any) {
    console.log(err);
    return res.json({
      error: err.message,
    });
  }
};

export const addDepartment = async (req: Request, res: Response) => {
  const { dept } = req.body;
  if (!dept.length) {
    return res.json({
      error: "Department is required",
    });
    
  }
  const { id }: any = req.user;
  console.log("hI", id);
  try {
    const Posts = await pool.query(
      `INSERT INTO departments (dept_name, postedby) VALUES ($1, $2) RETURNING *`,
      [dept, 2]
    );
    return res.json({
      message: "Department created successfully",
      data: Posts.rows[0],
    });
  } catch (err: any) {
    console.log(err);
    return res.json({
      error: err.message,
    });
  }
};

export const deptByUser = async (req: Request, res: Response) => {
  try {
    const { id }: any = req.user;
    const Posts = await pool.query(
      `SELECT * FROM departments WHERE postedby = $1`,
      [id]
    );
    return res.json(Posts.rows);
  } catch (err: any) {
    console.log(err);
    return res.json({
      error: err.message,
    });
  }
};
