import mongoose from 'mongoose';
import { Product } from '../../../components/mongoSchema'; // Adjust the path as needed

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const payload = req.body; // Assuming the JSON data is directly in the request body

      await mongoose.connect(process.env.Mongo_URI);

      let product = new Product(payload);
      const result = await product.save();
      
      return res.status(200).json({ result, success: true });
    } catch (error) {
      console.error('Error saving data to MongoDB:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'GET') {
    try {
      await mongoose.connect(process.env.Mongo_URI);
      const data = await Product.find();
      return res.status(200).json({ result: data });
    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
