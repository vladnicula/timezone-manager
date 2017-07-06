const JWT_SECRET = 'tsuminomai1561'
export {JWT_SECRET}

const MONGO_DB_CON_STRING = process.env.MONGO_HOST || '127.0.0.1:27017'
export {MONGO_DB_CON_STRING}


const APP_PORT = parseInt(process.env.APP_PORT,10) || 3185
const APP_HOST = process.env.APP_HOST || 'localhost'

export {APP_PORT, APP_HOST}