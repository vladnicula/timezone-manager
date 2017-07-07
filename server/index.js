import setup from './setup'

import * as config from './config'

setup(config).then((app)=>{
  app.listen(config.APP_PORT, config.APP_HOST, () => {  
    console.log(`[Timezone Manager]: startup complete. Listening on  ${config.APP_HOST}:${config.APP_PORT}!`)
  })
})
