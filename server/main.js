import path from 'path'
import express from 'express'
import nconf from 'nconf'
import nunjucks from 'nunjucks'
import moment from 'moment'
import marked from 'marked'
import * as posts from './posts'

nconf.env().argv()
const env = nconf.get('NODE_ENV') || 'development'
console.log(`Starting with env ${env}.`)
nconf.file({
  file: path.join(__dirname, `../config/config-${env}.json`)
})

const app = express()
app.use(express.static('static'))

posts.load(path.join(__dirname, nconf.get('dir:posts')), nconf.get('dev'))

const nunjucksEnv = nunjucks.configure('templates', {
  express: app,
  autoescape: true,
  watch: nconf.get('dev')
})

nunjucksEnv.addGlobal('isDev', nconf.get('dev'))
nunjucksEnv.addFilter('displayDate', value => moment.utc(value).fromNow())
nunjucksEnv.addFilter('md', value => new nunjucks.runtime.SafeString(marked(value)))
nunjucksEnv.addFilter('siteTitle', value => value ? `${value} | Andreas McDermott` : 'Andreas McDermott')

function getContext(title) {
  const overrides = [...arguments].slice(1)
  return Object.assign.apply(null, [{title, postCount: posts.count()}].concat(overrides))
}

app.get('/about', (req, res) => {
  res.render('about.html', getContext('About'))
})

app.get('/posts', (req, res) => {
  res.render('posts.html', getContext('All Posts', {
    posts: posts.get()
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

app.get('/category/:category', (req, res) => {
  const matchingPosts = posts.query({category: req.params.category})
  if (matchingPosts) {
    res.render('posts.html', getContext(`Posts in category: ${req.params.category}`, {
      posts: matchingPosts
    }))
  } else {
    res.render('404.html')
  }
})

app.get('/tag/:tag', (req, res) => {
  const matchingPosts = posts.query({tags: req.params.tag})
  if (matchingPosts) {
    res.render('posts.html', getContext(`Posts with tag: ${req.params.tag}`, {
      posts: matchingPosts
    }))
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
  console.log(`Server running: http://localhost:${nconf.get('server:port')}`)
})
