const { MongoClient } = require('mongodb'); // Import the MongoClient

export default async function (event) {
  const uri = 'mongodb+srv://ssnc-Inventory:jIorzSeWzo3CETeA@cluster0.dd3cywd.mongodb.net/?retryWrites=true&w=majority'


  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect(); // Connect to MongoDB

    const inventoryItemsCollection = client.db("test").collection("inventoryitems");
    const inventoryListCollection = client.db("test").collection("InventoryList");
    console.log(inventoryItemsCollection, inventoryListCollection);

    const newItem = event.fullDocument; // The new entry in the inventoryitems collection

    // Fetch the existing InventoryList document
    const existingInventoryListDocument = await inventoryListCollection.findOne({ title: "Packaging Material" });

    if (existingInventoryListDocument) {
      // Calculate the deduction based on the newItem's itemData
      const deduction = calculateDeduction(newItem.itemData, existingInventoryListDocument);

      // Update the InventoryList collection with the updated document
      const result = await inventoryListCollection.updateOne({ title: "Packaging Material" }, { $inc: deduction });

      console.log(result);

      return result;
    } else {
      // Handle the case where the InventoryList document is not found
      console.log("InventoryList document not found.");
      return null;
    }
  } catch (error) {
    console.error("Error updating InventoryList:", error);
    return error;
  } finally {
    client.close(); // Close the MongoDB connection
  }
}

// Define a function to calculate the deduction
function calculateDeduction(newItemData, existingInventoryListDocument) {
  const deduction = {};

  for (const itemName in newItemData) {
    if (existingInventoryListDocument[itemName]) {
      // Deduct values based on the difference between existing and new values
      deduction[itemName] = -newItemData[itemName];
    }
  }

  return deduction;
}
