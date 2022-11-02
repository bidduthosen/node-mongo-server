const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json())



// user name : dbUser2
// pass: OgEihEjKF1LrNlsr




const uri = "mongodb+srv://dbUser2:OgEihEjKF1LrNlsr@cluster0.og8pjeq.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const userCollection = client.db('nodeMongoCrud').collection('user');


        app.get('/users', async (req, res)=>{
            const query = {};
            const cursor = userCollection.find(query);
            const user = await cursor.toArray();
            res.send(user);
        })

        app.get('/users/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const user = await userCollection.findOne(query);
            res.send(user);
        })

       app.post('/users', async(req, res)=>{
        const user = req.body;
        const result = await userCollection.insertOne(user);
        res.send(result)
       })

       app.put('/users/:id', async(req, res)=>{
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const user = req.body;
            const options = { upsert: true };
            const updateUser = {
                $set: {
                    name: user.name,
                    address: user.address,
                    email : user.email,
                }
            }
            const result = await userCollection.updateOne(filter, updateUser, options);
            res.send(result);
       })

       app.delete('/users/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id : ObjectId(id)};
        const result = await userCollection.deleteOne(query);
        console.log(result);
        res.send(result)
       })
    }
    finally{

    }
}

run().catch(err => console.log(err));


app.get('/', (req, res)=>{
    res.send('hello from node mongo crud server');
});

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
});