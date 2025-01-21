var express = require('express');
var router = express.Router();

router.post('/', async (req, res) => {
    const { responses, timeTaken } = req.body;

    if (!responses || timeTaken == null) {
        return res.status(400).json({ error: 'Invalid data' });
    }

    console.log('Survey answers:', responses);
    console.log('Time Taken:', timeTaken);

    res.status(200).json({ message: 'Survey submitted successfully!' });
});

router.get('/', async (req, res) => {
    // Example logic to respond to GET requests
    res.status(200).json({ message: 'Survey GET route is working!' });
});


module.exports = router;