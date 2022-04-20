import {check} from 'express-validator'

export const registerValidate = [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Email is required'),
    check('password').isLength({min:8}).withMessage('Password is required and should be 8 characters long'),
    check('mobile').not().isEmpty().withMessage('Mobile is required'),
    check('city').not().isEmpty().withMessage('City is required'),
    check('questions').not().isEmpty().withMessage('Question is required'),
    check('secret').not().isEmpty().withMessage('Secret is required'),
]
    
export const loginValidate = [
    check('email').isEmail().withMessage('Email is required'),
    check('password').isLength({min:8}).withMessage('Password is required and should be 8 characters long'),
]
export const forgotPasswordValidate = [
    check('email').isEmail().withMessage('Email is required'),
]
export const resetPasswordValidate = [
    check('newPassword').not().isEmpty().isLength({min:8}).withMessage('Password is required and should be 8 characters long'),
]  