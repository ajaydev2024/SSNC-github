import path from 'path';

export default async function saveToJson(req, res) {

  try {
    const { data } = req.body;
    const selectedItem = req.query.selectedItem; // Correctly accessing the selectedItem query parameter    
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 as months are zero-indexed
    const day = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    
    const fileName = `${selectedItem}@${day}${month}${year}_Time_${hour}-${minute}.json`;

    const filePath = path.join(process.cwd(), 'public', 'Summary', fileName);

    const jsonData = JSON.stringify(data, null, 2);

    const fs = require('fs');
    fs.writeFileSync(filePath, jsonData, 'utf-8');
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).json({ success: false, error: 'Error saving file' });
  }
}
