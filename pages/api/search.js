// File: pages/api/search.js

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const dirPath = path.join(process.cwd(), '/JSONData/ProductList');

  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error('Error reading files:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const searchQuery = req.query.query;

    if (searchQuery) {
      const words = searchQuery.toLowerCase().split(' ');
      const filteredFiles = files.filter((fileName) =>
        words.every((word) => fileName.toLowerCase().includes(word))
      );
      res.status(200).json(filteredFiles);
    } else {
      res.status(200).json(files);
    }
  });
}
