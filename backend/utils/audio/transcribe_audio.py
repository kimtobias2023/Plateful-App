import sys
import json
import whisper

def transcribe(audio_path, model_size):
    """
    Transcribe the given audio file using a specified Whisper model size.

    Parameters:
    - audio_path: The file path to the audio file to be transcribed.
    - model_size: The size of the Whisper model to use for transcription.
    """
    # Load the Whisper model of the specified size
    model = whisper.load_model(model_size)
    
    # Perform transcription on the audio file
    result = model.transcribe(audio_path)
    
    # Output the transcription result as a JSON string
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    # Ensure the script is called with the correct number of arguments
    if len(sys.argv) != 3:
        print("Usage: python whisper_transcribe.py <audio_path> <model_size>")
        sys.exit(1)
    
    # Extract the audio file path and model size from the command line arguments
    audio_path = sys.argv[1]  # Path to the audio file
    model_size = sys.argv[2]  # Whisper model size, e.g., "base", "small", "medium", "large"

    # Call the transcribe function with the provided arguments
    transcribe(audio_path, model_size)



