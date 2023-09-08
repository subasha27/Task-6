import { Request, Response } from "express";
import Participant from "../model/UserModel";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
import EmailService from "../Helpers/Nodemailer";
import dotenv from 'dotenv';
dotenv.config();



class UserCrud {
    async signUp(req: Request, res: Response) {
        try {
            const existingUser = await Participant.findOne({ where: { mail: req.body.mail } });
            if (existingUser) return res.status(200).send({ message: 'User Already exists' });
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const userDetails = {
                name: req.body.name,
                mail: req.body.mail,
                password: hashedPassword,
            };

            const userData = await Participant.create(userDetails);
            const id = userData.id;
            return res.status(200).send({ message: 'User Created Successfully', id });
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Server Error" })
        }
    }
    async login(req: Request, res: Response) {
        try {
            const userDetails = req.body;
            const existingUser = await Participant.findOne({ where: { mail: req.body.mail } });
            if (!existingUser) return res.status(200).send({ message: 'User Does not exists' });
            else {
                const passwordMatch = await bcrypt.compare(userDetails.password, existingUser.password);
                if (passwordMatch) {
                    const id = existingUser.id
                    const token = jwt.sign(userDetails.mail, process.env.secretKey as string);
                    return res.status(200).send({ message: 'User Login Successfull', id, token });
                } else {
                    return res.status(200).send({ message: 'Invalid Password' });
                }
            }
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Server Error" })
        }
    }

    async detailUpdate(req: Request, res: Response) {
        try {
            const userDetails = req.body;
            const updateName = req.body.updateName;
            const updatePassword = req.body.updatePassword;
            const existingUser = await Participant.findOne({ where: { mail: req.body.mail } });
            if (!existingUser) return res.status(200).send({ message: 'User Does not exists' });
            else {
                console.log(existingUser.password)
                console.log(userDetails)
                const passwordMatch = await bcrypt.compare(userDetails.password, existingUser.password);
                if (passwordMatch) {
                    if (updateName) {
                        userDetails.name = updateName
                        await existingUser.update(userDetails.name)
                        return res.status(200).send({ message: 'User Name updated Successfully' });
                    }
                    if (updatePassword) {
                        const hashedPassword = await bcrypt.hash(updatePassword, 10);
                        userDetails.password = hashedPassword
                        await existingUser.update(userDetails.password)
                        return res.status(200).send({ message: 'User Password updated Successfully' });
                    }
                } else {
                    return res.status(200).send({ message: 'Invalid Password' });
                }
            }
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Server Error" })
        }
    }
    async forgotPassword(req: Request, res: Response) {
        try {
            const userEmail = req.body.mail;
            const existingUser = await Participant.findOne({ where: { mail: userEmail } });
            if (!existingUser) return res.status(200).send({ message: 'User Does not exist' });

            const resetToken = jwt.sign({ mail: userEmail }, process.env.secretKey as string, { expiresIn: '1h' });
            const subject = "Password Reset Request"
            const text = `To reset your password, click on the following link:http://localhost:1400/api/reset-password/${resetToken}`
            await EmailService.sendEmail(userEmail,subject, text);

            return res.status(200).json({ message: 'Reset email sent successfully' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server Error' });
        }
    }

    async resetPassword(req: Request, res: Response) {
        const { token } = req.params;
        const { password } = req.body;

        try {

            const { mail } = jwt.verify(token, process.env.secretKey as string) as { mail: string };
            const hashedPassword = await bcrypt.hash(password, 10);
            await Participant.update({ password: hashedPassword }, { where: { mail } });

            res.status(200).json({ message: 'Password reset successful' });
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: 'Invalid or expired token' });
        }
    }
}
export default new UserCrud();