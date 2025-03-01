import {prisma} from '../../lib/db'

export const getAllUser = async () => {
    const users = await prisma.user.findMany()
    return users
}