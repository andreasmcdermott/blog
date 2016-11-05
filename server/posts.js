import fs from 'fs'
import path from 'path'
import sane from 'sane'
import yaml from 'yaml-front-matter'
import moment from 'moment'

function watchPosts(folder, callback) {
  const watcher = sane(folder, {glob: ['**/*.md']})
  watcher.on('ready', () => {
    console.log('sane is ready')
  })
  watcher.on('add', callback)
  watcher.on('change', callback)
  watcher.on('delete', callback)
}

let cache = {}
let allPosts = []

function cachePosts(folder) {
  const _cache = {}
  const _allPosts = []
  const files = fs.readdirSync(folder)
  files.forEach(file => {
    const fileInfo = path.parse(file)
    if (fileInfo.ext !== '.md') {
      return;
    }

    const content = fs.readFileSync(path.join(folder, file))
    const post = yaml.loadFront(content, 'content')

    const matchForTitle = post.content.match(/^\s*# ([^\n]*)\n\n/m)
    if (matchForTitle) {
      post.title = matchForTitle[1]
      post.content = post.content.slice(matchForTitle[0].length)
      post.content = post.content.replace(/##/g, '###')
    }

    if (post.date instanceof Date) {
      post.date = moment.utc(post.date).valueOf()
    } else if (post.date.toString().match(/^\d{4}-\d{2}-\d{2}$/)) {
      post.date = moment.utc(post.date, 'YYYY-MM-DD').valueOf()
    } else {
      console.log('Date is in weird format..', post.date)
      return
    }

    if (!post.slug) {
      post.slug = path.parse(file).name.toLowerCase()
    }

    _cache[post.slug] = post
    _allPosts.push(post)
  })

  _allPosts.sort((p0, p1) => {
    if (p0.date < p1.date) return -1
    if (p0.date > p1.date) return 1
    return 0
  })

  cache = _cache
  allPosts = _allPosts
}

export function load(folder, dev = false) {
  cachePosts(folder)

  watchPosts(folder, () => {
    if (dev) console.log('Reloading posts...')
    cachePosts(folder)
  })
}

export function count() {
  return allPosts.length;
}

export function get() {
  const args = [...arguments]
  if (args.length === 1 && typeof args[0] === 'string') {
    const slug = args[0]
    return cache[slug]
  } else if (args.length === 0 || typeof args[0] === 'number') {
    const limit = args[0]
    return allPosts.slice(0, limit || allPosts.length)
  }
}

export function query(filter) {
  const key = Object.keys(filter).pop()
  return allPosts.filter(post => {
    const val = post[key]
    if (typeof val === 'string') {
      return val === filter[key]
    } else {
      return val.includes(filter[key])
    }
  })
}
