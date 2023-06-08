require('dotenv').config();

export const SERVER_PORT: number = Number( process.env.PORT ) || Number( process.env.DEVPORT);