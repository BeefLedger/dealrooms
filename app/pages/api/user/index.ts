import { NextApiRequest, NextApiResponse } from 'next'
import { Methods } from "lib/api/request"
import { UserModel } from "lib/db/users/users.model";
import { connect, disconnect } from "lib/db/connection"
import { IUserDocument } from 'lib/db/users/users.types';

const ALLOWED_METHODS = [Methods.POST, Methods.GET]

export default function userHandler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === Methods.POST) {
        handlePost(req, res)
    }
    else if (req.method === Methods.GET) {
        handleGet(req, res)
    }
    else {
        res.setHeader('Allow', ALLOWED_METHODS)
        res.status(405).end(`Method ${req.method} Not Allowed`)       
    }        
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {  

    await connect()   
    const result = await UserModel.find()
    res.status(201).json(result)
}


async function handlePost(req: NextApiRequest, res: NextApiResponse) {  
    console.log(1)
    await connect()
    console.log(2)
    
    const userData: IUserDocument = req.body as IUserDocument
    console.log(3, `${JSON.stringify(userData, undefined, 4)}`)
    const result = await UserModel.create(userData)
    
    res.status(201).json(result)
}