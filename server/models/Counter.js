import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // por ejemplo "order"
  value: { type: Number, default: 1 }
});

const Counter = mongoose.model("Counter", CounterSchema);

// ✔ función para obtener el siguiente número
export const getNextOrderNumber = async () => {
  const result = await Counter.findOneAndUpdate(
    { name: "order" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  return result.value;
};

export default Counter;
