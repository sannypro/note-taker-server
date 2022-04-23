const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
var cors = require('cors');
const query = require('express/lib/middleware/query');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('CRUD server is running')
})
// midleware
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.duygn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    client.connect(err => {
        const notesCollection = client.db("noteTaker").collection("note");






        try {

            app.get('/', async (req, res) => {
                await client.connect();
                const query = req.query;
                const cursor = notesCollection.find(query);

                const notes = await cursor.toArray();
                res.send(notes)
            })
            app.post('/note', async (req, res) => {

                const data = req.body

                const result = await notesCollection.insertOne(data);
                res.send(result)
            });
            app.put('/note/:id', async (req, res) => {
                const id = req.params.id;
                const data = req.body
                const filter = { _id: ObjectId(id) };
                const options = { upsert: true };
                const updateDoc = {
                    $set: {
                        ...data
                    },

                };
                const result = await notesCollection.updateOne(filter, updateDoc, options);
                res.send(result)

            })
            app.delete('/note/:id', async (req, res) => {
                const id = req.params.id;
                const filter = { _id: ObjectId(id) };
                const result = await notesCollection.deleteOne(filter);
                res.send(result)
            })
        }

        finally {

        }




        console.log("connected to db");

    });

}
run().catch(console.dir);
