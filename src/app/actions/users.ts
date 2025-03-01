"use server"

import {prisma} from '../../lib/db'

export const createUser = async (formData : FormData) => {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmpass = formData.get("confirmpass") as string
    const phone = formData.get("phone") as string

    if (!name || !email || !password || !confirmpass || !phone)
    {
        return {success: false, message: "All fields are required"}
    }

    if (password !== confirmpass)
    {
        return {success: false, message: "Passwords do not match"}
    }

    const existingUser = await prisma.user.findFirst({
        where : {
            email : email
        }
    })
    if (existingUser)
    {
        return {success: false, message: "Email is already registered"}
    }
    
    await prisma.user.create({
        data : {
            name : name,
            email : email,
            password : password,
            phone : phone,
            isOrganizer : false,
            profile_image : ""
        }
    })
    
    return {success:true, message: "User successfully Created"}
}

export const loginUser = async (formData: FormData) => {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password){
        return {success: false, message: "Input empty fields"}
    }

    const findUser = await prisma.user.findFirst({
        where : {
            email : email,
            password : password
        }
    })

    if (!findUser){
        return {success: false, message: "Invalid email/password"}
    }
    
    return {success: true, message: "Login Successful"}
}

