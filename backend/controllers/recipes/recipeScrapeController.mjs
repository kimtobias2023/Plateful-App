import { scrapeRecipeUrlService } from '../../services/recipes/index.mjs';

const recipeScrapeController = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null; // Check if req.user exists
        if (!userId) {
            console.error('User ID not found in request.');
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Add logging for URL and userId
        console.log('Scraping URL:', url);
        console.log('User ID:', userId);

        // Inside recipeScrapeController, after calling scrapeRecipeUrlService
        const recipeData = await scrapeRecipeUrlService(url, userId);
        console.log('Recipe scraped successfully:', recipeData);
        return res.status(200).json(recipeData); // This should include the recipe ID


        res.status(200).json(recipeData);
    } catch (error) {
        console.error('Error in recipeScrapeController:', error);
        res.status(500).json({ error: 'Failed to scrape recipe' });
    }
};

export { recipeScrapeController };
