import { readdir, readFile, stat } from 'fs/promises';
import { join, extname } from 'path';

export default async function handler(req, res) {
  try {
    const dirPath = join(process.cwd(), 'public', 'Summary');
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

    const validJsonFileContents = await Promise.all(
      fileStats
        .filter(content => content !== null)
        .map(async content => {
          const { fileName } = content;
          const filePath = join(dirPath, fileName);
          try {
            const contentBuffer = await readFile(filePath); // Add this line
            const parsedContent = JSON.parse(contentBuffer);
            return { fileName, ...parsedContent, birthDate: content.stat.birthtimeMs };
          } catch (readError) {
            console.error(`Error reading or parsing file ${fileName}:`, readError);
            return null;
          }
        })
    );

    // Filter out null contents
    const filteredContents = validJsonFileContents.filter(content => content !== null);
    const sortedContents = filteredContents
      .sort((a, b) => b.birthDate - a.birthDate);

    res.status(200).json(sortedContents);
  } catch (error) {
    console.error('Error fetching item data:', error);

    res.status(500).json({ error: 'Internal Server Error' });
  }
}
