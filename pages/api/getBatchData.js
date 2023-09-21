import fs from 'fs/promises';

const readJSFile = async (filePath) => {
  try {
    // eslint-disable-next-line node/no-template-curly-in-string
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return fileContent;
  } catch (error) {
    console.error('Error reading file:', error);
  }
  
};

export default readJSFile;
