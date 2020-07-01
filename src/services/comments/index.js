const express = require("express")
const router = express.Router()
const uniqid = require("uniqid")
const {check, validationResult} = require("express-validator")
const{getBooks, getComments, writeComments} = require("../../lib")

router.get("/", async(req, res, next) => {
    //get all comments
    try {
        const comments = await getComments()
        console.log(comments)
        res.send(comments)
    } catch (error) {
        console.log(error)
        const err = new Error("While getting Comments list a problem occurred!")
        next(err)
    }
})

router.get("/:asin", async(req, res, next) => {
    //get single comment
    try {
        const comments = await getComments()
        const comment = comments.find((com) => com.asin === req.params.id)
        if (comment){
            res.send(comment)
        } else {
            const err = new Error()
            err.httpStatusCode = 404
            next(error)            
        }
    } catch (error) {
        console.log(error)
        next("While getting comments list a problem occurred!")
    }
})

router.post(
    "/",
    [
      check("comment").exists().withMessage("Comment is missing"),
      check("userName").exists().withMessage("UserName is missing"),
      check("asin").exists().withMessage("book id is missing"),
    ],
    async (req, res, next) => {
      //Is there any book with the given asin?
      const errors = validationResult(req)
      console.log(errors)
      if (!errors.isEmpty()) {
        const error = new Error()
        error.httpStatusCode = 400
        error.message = errors
        next(error)
      } else {
        try {
          const books = await getBooks()
          const bookExist = books.find(
            (book) => book.commentId === req.body.id
          )
          if (bookExist) {
            const toAdd = {
              ...req.body,
              createdAt: new Date(),
              
              commentId: uniqid(),
            }
            const Comments = await getComments()
            Comments.push(toAdd)
            await writeComments(Comments)
            res.send(toAdd)
          } else {
            const error = new Error("Book id is wrong")
            error.httpStatusCode = 400
            next(error)
          }
        } catch (error) {
          console.log(error)
          next(error)
        }
      }
    }
  )
  
  router.delete("/:asin", async (req, res, next) => {
    try {
      const Comments = await getComments()
  
      const commentFound = Comments.find((comment) => comment._id === req.params.id)
      if (!commentFound) {
        const error = new Error("comment not found")
        error.httpStatusCode = 404
        next(error)
      } else {
        const filteredItems = Comments.filter(
          (comment) => comment._id !== req.params.id
        )
        await writeComments(filteredItems)
        res.send("Deleted")
      }
    } catch (error) {
      console.log(error)
      next(error)
    }
  })
  
  router.put("/:id", async (req, res, next) => {
    try {
      //Is there any product with the given elementId?
      const books = await getBooks()
  
      if (
        req.body.elementId &&
        !books.find((prod) => prod._id === req.body.elementId)
      ) {
        const error = new Error("Product id is wrong")
        error.httpStatusCode = 400
        next(error)
      } else {
        const Comments = await getComments()
        const comment = Comments.find((prod) => prod._id === req.params.id)
        if (comment) {
          const position = Comments.indexOf(comment)
          const commentUpdated = { ...comment, ...req.body }
          Comments[position] = commentUpdated
          await writeComments(Comments)
          res.send(commentUpdated)
        } else {
          const error = new Error(`comment with id ${req.params.id} not found`)
          error.httpStatusCode = 404
          next(error)
        }
      }
    } catch (error) {
      next(error)
    }
  })
  
  module.exports = router