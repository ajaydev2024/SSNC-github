import mongoose from 'mongoose';
import { Product } from '../../../components/mongoSchema'; // Adjust the path as needed

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const payload = req.body; // Assuming the JSON data is directly in the request body
      await mongoose.connect('mongodb+srv://ssnc-Inventory:jIorzSeWzo3CETeA@cluster0.dd3cywd.mongodb.net/?retryWrites=true&w=majority');

      let product = new Product(payload);
      const result = await product.save();
     console.log("POST request : ", result)
      // Close the MongoDB connection after the operation is complete
      mongoose.connection.close();
      return res.status(200).json({ result, success: true });
    } catch (error) {
      console.error('Error saving data to MongoDB:', error);

      // Close the MongoDB connection in case of an error
      mongoose.connection.close();

      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'GET') {
    try {
      await mongoose.connect('mongodb+srv://ssnc-Inventory:jIorzSeWzo3CETeA@cluster0.dd3cywd.mongodb.net/?retryWrites=true&w=majority');
      const data = await Product.find();
     
      mongoose.connection.close();

      console.log('Data fetched successfully');
      return res.status(200).json({ result: data });
    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);

      // Close the MongoDB connection in case of an error
      mongoose.connection.close();

      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
