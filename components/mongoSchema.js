import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  selectedItem: String,
  itemData: {
    Weight: Number,
    "Zeta Alanine": Number,
    "Vit E": Number,
    Taurine: Number,
    Caffeine: Number,
    "Vit A": Number,
    "Vit C": Number,
    "Carnitine Tartrate": Number,
    "Citric Acid": Number,
    Flavour: Number,
    Malto: Number,
    "Calcium Silicate": Number,
    "Silicon Dioxide": Number,
    Sucralose: Number,
    "Ace K": Number,
    Color: Number,
    "19 oz Pet Black Bottle": Number,
    "01 Silica (10gm)": Number,
    "Scoop 7.5cc": Number,
    "89mm Pole Cap": Number,
    "Carton 19oz - 12pk": Number,
  },
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
  totalBatch3Elements: Number,
});

const Product = mongoose.model('Product', productSchema);

export { Product };
