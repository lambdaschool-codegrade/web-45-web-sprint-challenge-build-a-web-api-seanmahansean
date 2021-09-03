// Write your "actions" router here!
const express = require("express");
const Actions = require("./actions-model");

const {
  validateActionId,
  validateAction
} = require("./actions-middlware");

const router = express.Router();

router.get("/", (req, res) => {
  Actions.get()
    .then(act => {
      res.status(200).json(act);
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      })
    })
})

router.get("/:id", validateActionId, (req, res) => {
  res.json(req.action)
})

router.post("/", (req, res, next) => {
  Actions.insert(req.body)
    .then(nAct => {
      res.status(201).json(nAct)
    })
    .catch(next())
})

router.delete("/:id", validateActionId, async (req, res, next) => {
  try{
    await Actions.remove(req.params.id)
    res.json(req.action)
  }catch(err){
    next(err)
  }
})

router.put("/:id", validateAction, validateActionId, (req, res, next) => {
  Actions.update(req.params.id, req.body)
    .then(() => {
      return Actions.get(req.params.id)
    })
    .then(act => {
      res.json(act)
    })
    .catch(next())
})

router.use((err, req, res) => {
  res.status(err.status || 500).json({
    err: err.message,
    stack: err.stack
  })
})

module.exports = router;