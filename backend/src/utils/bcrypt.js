import bcrypt from 'bcrypt'

const slot_rounds = 10

export const hash_password = async(password) =>{
    return await bcrypt.hash(password, slot_rounds)
}

export const compare_password = async (password, hash) => {
    return await bcrypt.compare(password, hash)
}