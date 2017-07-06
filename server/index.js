import setup from './setup'

const APP_PORT = parseInt(process.env.APP_PORT,10) || 3185
const APP_HOST = process.env.APP_HOST || 'localhost'

setup({
  APP_PORT,
  APP_HOST
}).then((app)=>{
  app.listen(APP_PORT, APP_HOST, () => {  
    console.log(`[Media Service]: startup complete. Listening on  ${APP_HOST}:${APP_PORT}!`)
  })
})
