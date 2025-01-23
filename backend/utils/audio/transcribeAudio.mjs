import { exec } from "child_process";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Convert import.meta.url to a file path for __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


console.log(`Looking in directory: ${__dirname}`);

fs.readdir(__dirname, (err, files) => {
    if (err) console.log(err);
    else {
        console.log("Directory contents:");
        files.forEach(file => {
            console.log(file);
        });
    }
});

export function transcribeAudio(audioPath, modelSize, callback) {
    console.log("About to execute transcribeAudio function");

    // Verify audio file exists
    fs.access(audioPath, fs.constants.F_OK, (err) => {
        console.log(`${audioPath} ${err ? 'does not exist' : 'exists'}`);
        if (err) {
            if (typeof callback === 'function') {
                console.log(typeof callback); // This should log 'function'

                callback('Audio file does not exist');
            } else {
                console.error('Callback function not provided or not a function.');
            }
            return;
        }
    });

    const scriptPath = path.join(__dirname, 'transcribe_audio.py');
    console.log(`Path to Python script: ${scriptPath}`);

    const pythonExecutable = 'C:\\Users\\tobia\\OneDrive\\Documents\\Kim\\Business\\Projects\\whisper-models\\whisperenv\\Scripts\\python.exe';

    fs.access(scriptPath, fs.constants.F_OK, (err) => {
        console.log(`${scriptPath} ${err ? 'does not exist' : 'exists'}`);
    });

    const command = `"${pythonExecutable}" "${scriptPath}" "${audioPath}" "${modelSize}"`;
    console.log(`Executing command for transcription: ${command}`);

    exec(command, { maxBuffer: 1024 * 5000 }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Whisper STT: ${error.message}`);
            if (typeof callback === 'function') {
                callback(`Error executing Whisper STT: ${error.message}`);
            } else {
                console.error('Callback function not provided or not a function.');
            }
            return;
        }
        if (stderr) {
            console.error(`Whisper STT stderr: ${stderr}`);
            if (typeof callback === 'function') {
                callback(`Whisper STT stderr: ${stderr}`);
            } else {
                console.error('Callback function not provided or not a function.');
            }
            return;
        }
        console.log("Raw transcription result:", stdout);
        try {
            const result = JSON.parse(stdout);
            if(result.text) {
                if (typeof callback === 'function') {
                    callback(null, result.text);
                } else {
                    console.error('Callback function not provided or not a function.');
                }
            } else {
                console.error("Transcription result does not contain 'text'.");
                if (typeof callback === 'function') {
                    callback("Transcription result is missing the 'text' property.");
                } else {
                    console.error('Callback function not provided or not a function.');
                }
            }
        } catch (parseError) {
            console.error(`Error parsing transcription result: ${parseError}`);
            if (typeof callback === 'function') {
                callback(`Error parsing transcription result: ${parseError}`);
            } else {
                console.error('Callback function not provided or not a function.');
            }
        }
    });
}





