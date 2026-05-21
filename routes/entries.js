var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

var upload = multer({ storage: storage });

var entrySchema = new mongoose.Schema({
    title: String,
    memory: String,
    year: String,
    emotion: String,
    clarity: String,
    image: String,

    comments: [
        {
            text: String
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now
    }
});

var Entry = mongoose.model('Entry', entrySchema);

router.get('/', async function (req, res, next) {
    try {
        const entries = await Entry.find().sort({ createdAt: -1 });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ error: "Could not get entries." });
    }
});

router.post('/', upload.single('image'), async function (req, res, next) {
    try {
        let imagePath = "";

        if (req.file) {
            imagePath = "/uploads/" + req.file.filename;
        }

        const newEntry = new Entry({
            title: req.body.title,
            memory: req.body.memory,
            year: req.body.year,
            emotion: req.body.emotion,
            clarity: req.body.clarity,
            image: imagePath,
            comments: []
        });

        const savedEntry = await newEntry.save();
        res.status(201).json(savedEntry);

    } catch (error) {
        res.status(400).json({ error: "Could not create entry." });
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        const id = req.params.id;
        const entry = await Entry.findById(id);

        if (!entry) {
            return res.status(404).json({ error: "Entry not found." });
        }

        res.json(entry);
    } catch (error) {
        res.status(500).json({ error: "Could not get this entry." });
    }
});

router.put('/:id', async function (req, res, next) {
    try {
        const id = req.params.id;

        const updatedEntry = await Entry.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        if (!updatedEntry) {
            return res.status(404).json({ error: "Entry not found." });
        }

        res.json(updatedEntry);
    } catch (error) {
        res.status(400).json({ error: "Could not update entry." });
    }
});

router.delete('/:id', async function (req, res, next) {
    try {
        const id = req.params.id;
        const deletedEntry = await Entry.findByIdAndDelete(id);

        if (!deletedEntry) {
            return res.status(404).json({ error: "Entry not found." });
        }

        res.json({ message: "Entry deleted." });
    } catch (error) {
        res.status(500).json({ error: "Could not delete entry." });
    }
});

/* POST comment */
router.post('/:id/comments', async function (req, res) {
    try {
        const entry = await Entry.findById(req.params.id);

        if (!entry) {
            return res.status(404).json({
                error: "Entry not found."
            });
        }

        entry.comments.push({
            text: req.body.text
        });

        await entry.save();

        res.json(entry);

    } catch (error) {
        res.status(500).json({
            error: "Could not add comment."
        });
    }
});

module.exports = router;