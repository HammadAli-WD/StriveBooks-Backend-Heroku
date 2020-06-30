const {join} = require("path")
 const {readDB , writeDB} = require ("./utilities")

 const booksFile = join(__dirname, "../services/books/books.json")
 const commentsFile = join(__dirname, "../services/comments/index.json")

 module.exports = {
     getBooks : async() => readDB(booksFile),
     getComments : async() => readDB(commentsFile),
     writeBooks: async(data) => writeDB(booksFile, data),
     writeComments: async(data) => writeDB(commentsFile, data)
 }