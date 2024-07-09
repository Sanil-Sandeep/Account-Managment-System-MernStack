const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

// Counter schema and model for tracking the custom ID
const counterSchema = new mongoose.Schema({
    seq: { type: Number, default: 0 }
});
const counterModel = mongoose.model("counter", counterSchema);

// User schema
const schemaData = new mongoose.Schema({
    customId: String,
    name: String,
    email: String,
    mobile: String,
}, {
    timestamps: true
});

// Pre-save hook to generate custom ID
schemaData.pre('save', async function(next) {
    if (this.isNew) {
        const counter = await counterModel.findOneAndUpdate(
            {},
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        const seqNum = counter.seq.toString().padStart(5, '0'); // Ensure the sequence number is 5 digits long with leading zeros
        this.customId = `uid${seqNum}`;
    }
    next();
});

const userModel = mongoose.model("user", schemaData);



// Read data
//http://localhost:8080/
app.get("/", async (req, res) => {
    const data = await userModel.find({});
    res.json({ success: true, data: data });
});




// Create data
//http://localhost:8080/create
/*
  {
    name,
    email,
    mobile
  }
*/
app.post("/create", async (req, res) => {
    console.log(req.body);
    const data = new userModel(req.body);
    await data.save();
    res.send({ success: true, message: "Data saved successfully", data : data });
});




//update data 
//http://localhost:8080/update
/*
  {
     id : "",
     name : "",
     mobile : ""
  }
*/
app.put("/update", async(req,res) => {
   console.log(req.body)
   const { _id,...rest } = req.body
   console.log(rest)
   const data = await  userModel.updateOne({_id : _id}, rest)
   res.send({success : true, message : "data updated successfully", data : data})
})




//delete api
//http://localhost:8080/delete/id


app.delete("/delete/:id", async(req,res) => {
    const id = req.params.id
    console.log(id)
    const data = await userModel.deleteOne({_id : id})
    res.send({success : true, message : "data deleted successfully", data : data})
})


mongoose.connect("mongodb+srv://sanilsandeep:sanil002200@accountmanagement.ft6ocvp.mongodb.net/accountmanagement?retryWrites=true&w=majority")
    .then(() => {
        console.log("Connected to database");
        app.listen(PORT, () => console.log("Server is running"));
    })
    .catch((err) => console.log(err));







