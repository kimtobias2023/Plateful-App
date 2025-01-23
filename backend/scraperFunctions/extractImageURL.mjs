import cheerio from 'cheerio';

// Function to extract image URL using Cheerio
const extractImageURL = (htmlContent, config) => {
    const $ = cheerio.load(htmlContent);
    const recipeImageUrl = $(config.recipeImageUrl).attr('src');
    return recipeImageUrl;
};

export default extractImageURL;