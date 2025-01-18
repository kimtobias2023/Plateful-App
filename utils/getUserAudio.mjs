// src/utils/startRecording.mjs

// Ensure getUserAudio is correctly implemented
export const getUserAudio = async () => {
    try {
        const constraints = { audio: true };
        return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (error) {
        console.error('Error accessing microphone:', error);
        throw error; // Rethrow to allow further handling
    }
};
