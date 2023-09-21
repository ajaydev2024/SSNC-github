import { readdir, readFile, stat } from 'fs/promises';
import { join, extname } from 'path';

export default async function handler(req, res) {
    try {
        const dirPath = join(process.cwd(), 'JSONData', 'InventoryList');
        const fileNames = await readdir(dirPath);

        const fileStatsPromises = fileNames.map(async (fileName) => {
            const ext = extname(fileName);
            if (ext === '.json') {
                const filePath = join(dirPath, fileName);
                try {
                    const contentStat = await stat(filePath);
                    return { fileName, stat: contentStat };
                } catch (statError) {
                    console.error(`Error getting file stat for ${fileName}:`, statError);
                    return null;
                }
            }
            return null;
        });

        const fileStats = await Promise.all(fileStatsPromises);

        const validJsonFileContents = fileStats
            .filter(content => content !== null)
            .sort((a, b) => a.stat.birthtimeMs - b.stat.birthtimeMs) // Sort by creation date
            .map(async content => {
                const { fileName } = content;
                const filePath = join(dirPath, fileName);
                try {
                    const contentBuffer = await readFile(filePath);
                    const contentString = contentBuffer.toString(); // Convert buffer to string
                    const parsedContent = JSON.parse(contentString);
                    const materials = Object.entries(parsedContent)
                        .filter(([key, value]) => key !== 'title')
                        .map(([name, value]) => ({ name, value }));
                    return { title: parsedContent.title, materials };
                } catch (readError) {
                    console.error(`Error reading or parsing file ${fileName}:`, readError);
                    return null;
                }
            });

        const validJsonFileContentsResolved = await Promise.all(validJsonFileContents);

        // Send the response with the data
        res.status(200).json({
            itemDatas: validJsonFileContentsResolved.filter(content => content !== null),
        });
    } catch (error) {
        console.error('Error fetching item data:', error);
        // Send an error response
        res.status(500).json({
            error: 'An error occurred while fetching item data',
        });
    }
}
