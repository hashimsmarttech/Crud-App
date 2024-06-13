const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/crud", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
    photo: String,
    path: String,
    originalname: String,
    mimetype: String,
    size: Number,
    uploadDate: { type: Date, default: Date.now }
});

const UserModel = mongoose.model("users", UserSchema);

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });
// Serve the uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create a new user
app.post("/createUser", upload.single('photo'), async (req, res) => {
    const { name, email, age } = req.body;
    const photo = req.file ? req.file.filename : null;

    try {
        const newUser = new UserModel({ name, email, age, photo });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a user by ID
app.put('/updateUser/:id', upload.single('photo'), async (req, res) => {
    const { id } = req.params;
    const { name, email, age } = req.body;
    const photo = req.file ? req.file.filename : null;

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(id, { name, email, age, photo }, { new: true });
        await updatedUser.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all users
app.get('/', (req, res) => {
    UserModel.find({})
        .then(users => res.json(users))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Get a user by ID
app.get('/getUser/:id', (req, res) => {
    const id = req.params.id;
     UserModel.findById({_id: id})
        .then(user => res.json(user))
        .catch(err => res.status(500).json({ error: err.message }));
});

// Delete a user by ID
app.delete('/deleteUser/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await UserModel.findByIdAndDelete(id);
        res.json(deletedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
