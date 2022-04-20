import bcrypt from "bcrypt";
import sgMail from "@sendgrid/mail";
import jwt from "jsonwebtoken";


sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);


export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};
export const comparePassword = (password:any, hashed:any) => {
    return bcrypt.compare(password, hashed);
  };
  
  export const resetHashPassword = async (newPassword: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(newPassword, salt);
    };
    



export const emailVerification = async (name:any, email:any, password:any,mobile:any,city:any,questions:any,secret:any) => {
    const token = await jwt.sign({name, email, password,mobile,city,questions,secret}, process.env.JWT_ACCOUNT_ACTIVATION as string, {expiresIn: "10m"});
    const emailData:any = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Account activation link`,
        html: `
        <h1>Please use the following link to activate your account</h1>
        <p>${process.env.CLIENT_URL}/activation/${token}</p>
        <hr/>
        <p>This email may contain sensitive information</p>
        <p>${process.env.CLIENT_URL}</p>
        `,
      }
      sgMail.send(emailData);

}