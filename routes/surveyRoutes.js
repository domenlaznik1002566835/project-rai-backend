const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const JAVA_PATH = 'java';
const WEKA_JAR_PATH = path.join(__dirname, '..', 'weka', 'weka.jar');
const WEKA_PREDICTOR_CLASS = 'WekaPredict1';
const WEKA_PREDICTOR_DIR = path.join(__dirname, '..', 'weka');
const MODEL_PATH = path.join(__dirname, '..', 'weka', 'trained_model.model');

router.post('/', async (req, res) => {
    const { responses, timeTaken } = req.body;
    console.log('Weka JAR Path:', WEKA_JAR_PATH);
    console.log('Weka Predictor Class:', WEKA_PREDICTOR_CLASS);
    console.log('Weka Predictor Directory:', WEKA_PREDICTOR_DIR);
    console.log('Model Path:', MODEL_PATH);

    if (!responses || timeTaken == null) {
        return res.status(400).json({ error: 'Invalid data' });
    }

    console.log('Survey answers:', responses);
    console.log('Time Taken:', timeTaken);

    // Prepare the input data as a comma-separated string matching the model's attributes
    const inputData = [
        responses.question1,  // home_info
        responses.question2,  // history_tracking
        responses.question3,  // reserve_locker
        responses.question4,  // manage_locker
        responses.question5,  // web_rating
        responses.question6,  // login_difficulty
        responses.question7,  // face_reliability
        responses.question8,  // registration_process
        responses.question9,  // scanner_accuracy
        responses.question10, // unlocking_reliability
        responses.question11, // history_navigation
        responses.question12, // mobile_rating
        timeTaken
    ].map(value => value || '0').join(','); // Provide default value if undefined

    try {
        // Construct the classpath correctly: include the directory of WekaPredictor.class and weka.jar
        const classpath = [
            WEKA_JAR_PATH,
            WEKA_PREDICTOR_DIR
        ].join(path.delimiter); // Automatically uses ':' or ';' based on OS

        const javaProcess = spawn(JAVA_PATH, [
            '-cp',
            classpath, // Correct classpath
            WEKA_PREDICTOR_CLASS,
            MODEL_PATH // Pass the model path here
        ]);

        let prediction = '';
        let errorOutput = '';

        // Send input data to the Java process
        javaProcess.stdin.write(inputData + '\n');
        javaProcess.stdin.end();

        // Capture standard output (prediction)
        javaProcess.stdout.on('data', (data) => {
            prediction += data.toString();
        });

        // Capture standard error (errors)
        javaProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        // Handle process exit
        javaProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`Java process exited with code ${code}: ${errorOutput}`);
                return res.status(500).json({ error: 'Error processing prediction.' });
            }

            try {
                // Clean and parse prediction
                prediction = prediction
                    .split('\n')
                    .filter(line => line.trim() === 'good' || line.trim() === 'bad')
                    .pop()
                    .trim();

                if (!prediction) {
                    console.error('Invalid prediction format');
                    return res.status(500).json({ error: 'Invalid prediction format.' });
                }

                // Create timestamp and filename
                const timestamp = Date.now();
                const filename = `${prediction}_survey_${timestamp}.txt`;
                const dir = path.join(__dirname, '..', 'survey_results');
                const filePath = path.join(dir, filename);

                // Prepare survey data
                const surveyData = `Time: ${new Date().toISOString()}
Survey Responses:
${Object.entries(responses).map(([q, a]) => `${q}: ${a}`).join('\n')}
Time Taken: ${timeTaken} seconds
Decision: ${prediction}`;

                // Ensure directory exists
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                // Write file
                fs.writeFileSync(filePath, surveyData, 'utf8');
                console.log(`Survey saved to: ${filePath}`);

                // Send response
                res.status(200).json({ 
                    message: 'Survey submitted successfully!', 
                    decision: prediction 
                });

            } catch (error) {
                console.error('Error saving survey:', error);
                res.status(500).json({ error: 'Error saving survey.' });
            }
        });

    } catch (error) {
        console.error('Error processing survey:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

router.get('/', async (req, res) => {
    res.status(200).json({ message: 'Survey GET route is working!' });
});

module.exports = router;
