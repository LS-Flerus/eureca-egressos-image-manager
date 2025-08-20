const express = require('express')
const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config();

const PORT = process.env.PORT || 8081

const app = express()
app.use(cors())
app.use(express.json({limit : "5mb"}))

const bd_url = process.env.DB_URL;

mongoose.connect(bd_url)
.then(() =>{
    console.log("Connect to DB")
}).catch((err) => {
    console.log(err)
})

const schema = new mongoose.Schema({
    image: String
})
const imageModel = mongoose.model("Image",schema)

app.get("/", async (req,res) => {
    //const data = await imageModel.find({})
    res.json({message : "Server running", data: res.statusCode})
})

app.get("/get/:id", async (req,res) => {
    if (ObjectId.isValid(req.params.id)) {
        const id = req.body
        const data = await imageModel.findOne({_id: new ObjectId(req.params.id)}).then(doc => {
            res.status(200).json(doc)
        })
        .catch(err => {
            res.status(500).json({error:'Could not fetch the document'})
        })
    } else {
        res.status(500).json({error: 'Could not fetch the document'})
    }
})

app.post("/upload", async (req,res) => {
    console.log(req.body)
    const image = new imageModel({
        image: req.body.img
    })
    const data = await image.save()
    console.log(data)
    res.send({data})
})

app.delete('/delete/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)) {
  
    imageModel
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then(result => {
        res.status(200).json(result)
      })
      .catch(err => {
        res.status(500).json({error: 'Could not delete document'})
      })
  
    } else {
      res.status(500).json({error: 'Could not delete document'})
    }
})

app.patch('/update/:id', (req, res) => {
    const updates = req.body
  
    if (ObjectId.isValid(req.params.id)) {
        imageModel
        .updateOne({ _id: new ObjectId(req.params.id) }, {$set: updates})
        .then(result => {
          console.log(req.params)
          res.status(200).json(result)
        })
        .catch(err => {
          res.status(500).json({error: 'Could not update document'})
        })
  
    } else {
      res.status(500).json({error: 'Could not update document'})
    }
})

app.listen(PORT, ()=>console.log("Server is running at "+PORT))

const url = process.env.RENDER_URL
const url_back = process.env.BACKEND_URL
const interval = 10000;


//Reloader Function
/*
async function reloadWebsite() {
  const res = await fetch(`${url}`, {
    method:"GET",
    headers: {
        "content-type" : "application/json"
    }
  })

  const res_back = await fetch(`${url_back}/server/ping`, {
    method:"GET",
    headers: {
      "ngrok-skip-browser-warning": "any",
    }
  })

  const data = await res.json()
  console.log(data)
}

setInterval(reloadWebsite, interval); 
*/