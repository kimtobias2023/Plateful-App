import cheerio from 'cheerio';

// Function to extract labels using Cheerio
const extractLabels = (htmlContent, config) => {
    const $ = cheerio.load(htmlContent);
    const { course, cuisine } = config;

    const courseLabel = $(course).text().trim();
    const cuisineLabel = $(cuisine).text().trim();

    return { courseLabel, cuisineLabel };
};

export default extractLabels;