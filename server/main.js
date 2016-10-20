import {join} from 'path'
import express from 'express'
import nconf from 'nconf'
import nunjucks from 'nunjucks'

nconf.env()
     .argv()
     .file({
       file: join(__dirname, '../config/config.json')
     })

const app = express()

app.use(express.static('static'))

nunjucks.configure('templates', {
  express: app,
  autoescape: true,
  watch: nconf.get('dev')
})

app.get('*', (req, res) => {
  res.render('index.html')
})

app.listen(nconf.get('server:port'), () => {
  console.log('Server started!')
})