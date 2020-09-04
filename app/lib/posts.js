import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map(fileName => {

    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Combine the data with the id
    return {...JSON.parse(fileContents), id: fileName.split(".")[0]}
  })
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.weight < b.weight) {
      return 1
    } else {
      return -1
    }
  })
}

