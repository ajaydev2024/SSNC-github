import path from 'path';
import readJSFile from '../pages/api/getBatchData';

async function DataFetcher(selectedItem) {

  if (!selectedItem) {
    return null;
  }

  try {
    const filePath = path.join(process.cwd(), 'JSONData', 'ProductList', `${selectedItem}.json`);

    const fileContent = await readJSFile(filePath);

    const selectedItemData = JSON.parse(fileContent);

    return Array.isArray(selectedItemData) && selectedItemData.length > 0 ? selectedItemData : null;
  } catch (error) {
    console.error('Error fetching item data by datafetcher.js :', error);
    return null;
  }
}

export default DataFetcher;
