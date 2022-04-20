import expressJwt from "express-jwt";
import express , {Request, Response,NextFunction} from "express";
import { pool } from "../db";
export const requiresSignin = expressJwt({
    secret: process.env.JWT_SECRET as string,
    algorithms: ["HS256"],
});

export const canEditDeletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id}: any = req.user;
        const post = await pool.query(
            `SELECT * FROM posts WHERE post_id = '${req.params.id}'`
        );
        if(id !== post.rows[0].postedby) {
            return res.status(400).send("mairu");
                  } else {
                    next();
                  }

    } catch (err:any) {
        console.log(err.message);
        return res.status(400).send("masuru");
        
    }
}


// export const canEditDeletePost = async (req, res, next) => {
//     try {
//       const post = await Post.findById(req.params._id);
//       console.log("POST in edit delete Middleware", post);
//       if (req.user._id != post.postedBy) {
//         return res.status(400).send("Unauthorized");
//       } else {
//         next();
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
  