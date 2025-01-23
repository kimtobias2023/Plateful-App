// controllers/audioController.mjs
import axios from 'axios';
import dotenv from 'dotenv';
import { transcribeAudio } from '../../utils/audio/index.mjs'; // Uncomment if you have an actual implementation

dotenv.config();


// controllers/audioController.mjs
export const transcribe = (req, res) => {
    const audioFile = req.files && req.files['audio'] ? req.files['audio'][0] : null;

    if (!audioFile) {
        console.error('No audio file uploaded.');
        return res.status(400).send('No audio file uploaded.');
    }

    console.log(`Uploading file size: ${audioFile.size} bytes.`);
    const audioPath = audioFile.path;
    const modelSize = req.body.modelSize || "medium"; // Allow users to specify the model size
    
    // Make sure to pass a proper callback function here
    transcribeAudio(audioPath, modelSize, (error, transcription) => {
        if (error) {
            console.error(`Transcription error: ${error}`);
            return res.status(500).send('Error during transcription');
        }
        console.log(`Transcription successful: ${transcription}`);
        res.json({ transcription });
    });
};


export const generateSpeech = async (req, res) => {
    const { text } = req.body;
    const voiceId = 'XrExE9yKIg1WjnnlVkGX'; // Ensure this is a valid voice ID
    const ELEVENLABS_BASE_URL = process.env.ELEVENLABS_BASE_URL;
    
    console.log('Received text for speech synthesis:', text);

    try {
        const response = await axios.post(
            `${ELEVENLABS_BASE_URL}/text-to-speech/${voiceId}`,
            {
                text,
                model_id: "eleven_monolingual_v1", // Changed to the default or confirm a valid model ID
                voice_settings: {
                    stability: 0.0,
                    similarity_boost: 1.0,
                    style: 0, // If this is required and you have a preferred style, set it here
                    use_speaker_boost: true // If this should be enabled, ensure it's included
                }
                // Consider adding optimize_streaming_latency or output_format if needed
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'audio/mpeg',
                    'xi-api-key': process.env.ELEVENLABS_API_KEY,
                },
                responseType: 'arraybuffer',
            }
        );

        console.log('ElevenLabs TTS Response:', response);

        res.writeHead(200, {
            'Content-Type': 'audio/mpeg',
            'Content-Length': response.data.length,
        });
        res.end(Buffer.from(response.data, 'binary'));
    } catch (error) {
        console.error('ElevenLabs TTS Error:', error);
        res.status(error.response?.status || 500).json({ error: 'Failed to generate speech' });
    }
};



const Audio = {
    transcribe,
    generateSpeech,
};
export { Audio };