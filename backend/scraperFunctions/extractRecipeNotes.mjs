import cheerio from 'cheerio';
import he from 'he';

const extractRecipeNotes = (htmlContent, config) => {
    try {
        const $ = cheerio.load(htmlContent);
        const { recipeNotes } = config;
        if (!recipeNotes) {
            console.error('Recipe notes selector not found in config. Skipping recipe notes extraction.');
            return [];
        }

        const notesContainer = $(recipeNotes);
        if (notesContainer.length === 0) {
            console.log('Recipe notes not found on the page.');
            return [];
        }

        let notes = [];

        notesContainer.find('li').each((index, element) => {
            const text = he.decode($(element).text().trim());
            if (text) notes.push(text);
        });

        if (notes.length === 0) {
            const text = he.decode(notesContainer.text().trim());
            if (text) notes = [text];
        }

        return notes.filter(note => note.trim() !== '');
    } catch (error) {
        console.error('Error extracting recipe notes:', error);
        return [];
    }
};

export default extractRecipeNotes;


