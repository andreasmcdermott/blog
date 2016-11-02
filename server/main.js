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
nunjucksEnv.addFilter('siteTitle', value => value ? `${value} | andreas mcdermott` : 'andreas mcdermott')

function getContext (title) {
  var overrides = [...arguments].slice(1) 
  return Object.assign.apply(null, [{ title, postCount: posts.count() }].concat(overrides))
}

app.get('/about', (req, res) => {
  res.render('about.html', getContext('About'))
})

app.get('/posts', (req, res) => {
  res.render('posts.html', getContext('All Posts', {
    posts: posts.get(),
  }))
})

app.get('/post/:slug', (req, res) => {
  const post = posts.get(req.params.slug)
  if (post) {
    res.render('post.html', getContext('Unnamed post', post, {metaDescription: post.abstract}))
  } else {
    res.render('404.html')
  }
})

app.get('*', (req, res) => {
  res.render('index.html', getContext(null, {
    posts: posts.get(5)
  }))
})

app.listen(nconf.get('server:port'), () => {
  console.log(`Server listenering on port ${nconf.get('server:port')}!`)
})