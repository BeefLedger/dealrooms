import { NextApiRequest, NextApiResponse } from 'next'
import { Methods } from "lib/api/request"
import { UserModel } from "lib/db/users/users.model";
import { connect, disconnect } from "lib/db/connection"
import { IUserDocument } from 'lib/db/users/users.types';

const ALLOWED_METHODS = [ Methods.GET, Methods.PUT]

export default function userHandler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === Methods.GET) {
        handleGet(req, res)
    }
    else if (req.method === Methods.PUT) {
        //handlePut(req, res)
    }
    else {
        res.setHeader('Allow', ALLOWED_METHODS)
        res.status(405).end(`Method ${req.method} Not Allowed`)       
    }        
}

function handleGet(req: NextApiRequest, res: NextApiResponse) {  
    res.status(200).json(
        {
            id: req.query.id,
            name: `User ${req.query.id}`
        }
    )
}
