import Mongoose from "mongoose";
import * as config from "config"

let database: Mongoose.Connection;

// Connect Mongoose to the DB server
export async function connect(): Promise<Mongoose.Connection> {
    const uri = `mongodb+srv://${config.db.user}:${config.db.password}@${config.db.server}/${config.db.database}?ssl=true`
    if (!database) {
        await Mongoose.connect(uri, {
            useNewUrlParser: true,
            useFindAndModify: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            tlsInsecure: true
        });
        database = Mongoose.connection;
    }
    return database
};

export async function disconnect(): Promise<void> {
    if (database) {
        await Mongoose.disconnect()
    }   
}

Mongoose.Promise = Promise

Mongoose.connection.on('connected', () => {
    console.log('Connection established')
})

Mongoose.connection.on('reconnected', () => {
    console.log('Connection re-established')
})

Mongoose.connection.on('disconnected', () => {
    console.log('Connection disconnected')
})

Mongoose.connection.on('close', () => {
    console.log('Connection closed')
})

Mongoose.connection.on('error', (error) => {
    console.error(error)    
})

