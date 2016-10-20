import path from 'path'
import express from 'express'
import nconf from 'nconf'
import nunjucks from 'nunjucks'
import moment from 'moment'
import marked from 'marked'

import * as posts from './posts'

nconf.env()
     .argv()
     .file({
       file: path.join(__dirname, '../config/config.json')
     })

const app = express()

app.use(express.static('static'))

posts.load(path.join(__dirname, nconf.get('dir:posts')), nconf.get('dev'))

const nunjucksEnv = nunjucks.configure('templates', {
  express: app,
  autoescape: true,
  watch: nconf.get('dev')
})

nunjucksEnv.addFilter('displayDate', value => moment.utc(value).format('MMMM DD, YYYY'))
nunjucksEnv.addFilter('md', value => new nunjucks.runtime.SafeString(marked(value)))
nunjucksEnv.addFilter('siteTitle', value => value ? `${value.toLowerCase()} | andreas mcdermott` : 'andreas mcdermott')

app.get('/about', (req, res) => {
  res.render('about.html', {
    title: 'About'
  })
})

app.get('/posts', (req, res) => {
  res.render('posts.html', {
    posts: posts.get(),
    title: 'All Posts'
  })
})

app.get('/post/:slug', (req, res) => {
  const post = posts.get(req.params.slug)
  if (post) {
    res.render('post.html', Object.assign({}, post, {metaDescription: post.abstract}))
  } else {
    res.render('404.html')
  }
})

app.get('*', (req, res) => {
  res.render('index.html', {})
})

app.listen(nconf.get('server:port'), () => {
  console.log(`Server listenering on port ${nconf.get('server:port')}!`)
})