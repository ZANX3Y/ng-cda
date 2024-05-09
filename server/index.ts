import cors from 'cors'
import express from 'express'
import SearchController from './SearchController'
import VideoController from './VideoController'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (_, res) => {
    res.send('Hello World!')
})

app.post('/video', VideoController.index)
app.post('/video/file', VideoController.file)
app.post('/video/comments', VideoController.comments)
app.post('/video/replies', VideoController.replies)

app.post('/search', SearchController.index)
app.post('/search/suggest', SearchController.suggest)

app.listen(3000, () => {
    console.log('Server running on port 3000')
})
