import cors from 'cors'
import express from 'express'
import CommentController from './CommentController'
import HomeController from './HomeController'
import SearchController from './SearchController'
import VideoController from './VideoController'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (_, res) => {
    res.send('Hello World!')
})

app.post('/home', HomeController.index)
app.post('/home/category', HomeController.category)
app.post('/home/categories', HomeController.categories)

app.post('/video', VideoController.index)
app.post('/video/file', VideoController.file)

app.post('/video/comments', CommentController.index)
app.post('/video/comment/replies', CommentController.replies)
app.post('/video/comment/upvote', CommentController.upvote)
app.post('/video/comment/add', CommentController.add)
app.post('/video/comment/reply', CommentController.reply)

app.post('/search', SearchController.index)
app.post('/search/suggest', SearchController.suggest)

app.listen(3000, () => {
    console.log('Server running on port 3000')
})
