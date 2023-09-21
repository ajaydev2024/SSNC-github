import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  selectedItem: String,
  itemData:[Object],
  totalServings: Number,
  boxes: Number,
  batch1: Number,
  batch2: Number,
  batch3: Number,
  boxElements: [Number],
  batch1Elements: [Number],
  batch2Elements: [Number],
  batch3Elements: [Number],
  totalBoxElements: Number,
  totalBatch1Elements: Number,
  totalBatch2Elements: Number,
  totalBatch3Elements: Number
});

let Product;

try {
  // Try to retrieve the existing model if it exists
  Product = mongoose.model("inventoryItems");
} catch (error) {
  // If the model doesn't exist, create it
  Product = mongoose.model("inventoryItems", productSchema);
}

export { Product };