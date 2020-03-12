// Day 5, full CRUD for chef collection - only

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
// import db login details
const myconn = require("./connection");

// every single collection will need a model
const Chef = require("./models/chef-model");

// init express
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
// end init express

// init database stuff
//setup database connection
mongoose.connect(myconn.atlas, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("connected", e => {
  console.log("Mongoose connected");
});

db.on("error", () => console.log("Database error"));
// end database stuff

// for now we have nothing on the top level
app.get("/", function(req, res) {
  return res.json({ result: false });
});
//end top level

// start of routes
const router = express.Router();
app.use("/api", router);

// find and return a single user based upon _id

router.get("/chef/:id", (req, res) => {
  Chef.findOne({ _id: req.params.id }, function(err, objFromDB) {
    //exit now if any kind of error

    if (err) return res.json({ result: false });

    res.send(objFromDB);
  });
});

// define CRUD api routes:
// CREATE
router.post("/chef", (req, res) => {
  var chefModel = new Chef();

  var data = req.body;
  console.log("++++ ", data);

  Object.assign(chefModel, data);

  chefModel.save().then(
    chef => {
      return res.json({ result: true });
      //OR
      // return res.json(chefModel);
    },
    () => {
      return res.json({ result: false });
    }
  );
});

// READ
router.get("/chef", (req, res) => {
  Chef.find().then(
    chefFromDataBase => {
      console.table(chefFromDataBase);
      return res.json(chefFromDataBase);
    },
    error => {
      console.log("error of some kind");
    }
  );
});

//UPDATE
router.put("/chef/:id", (req, res) => {
  Chef.findOne({ _id: req.params.id }, function(err, objFromDB) {
    if (err) return res.json({ result: false });
    var data = req.body;
    Object.assign(objFromDB, data);
    objFromDB.save();
    return res.json({ result: true });
    //OR
    // return res.send(objFromDB);
  });
});

// DELETE
router.delete("/chef/:id", (req, res) => {
  // as a promise
  Chef.deleteOne({ _id: req.params.id }).then(
    () => {
      return res.json({ result: true });
    },
    () => {
      return res.json({ result: false });
    }
  );
});

// deal with any unhandled urls on the api endpoint - place at end
router.get("/*", (req, res) => {
  return res.json({ result: "not a valid endpoint" });
});

// ditto for app route
app.get("/*", (req, res) => {
  return res.json({ result: "not a valid endpoint" });
});

// and finally,  lets listen
const port = 4003;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
