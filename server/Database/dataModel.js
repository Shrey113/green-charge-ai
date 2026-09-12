import mongoose from "mongoose";

// Schema for 'car_customer' collection (MongoDB Atlas green_charge_ai)
const carCustomerSchema = new mongoose.Schema(
  {},
  {
    strict: false,
    collection: "car_customer",
  }
);

export const CarCustomer =
  mongoose.models.CarCustomer || mongoose.model("CarCustomer", carCustomerSchema);

// Schema for generic/default 'data' collection
const dataSchema = new mongoose.Schema(
  {},
  {
    strict: false,
    collection: "data",
  }
);

export const EVData =
  mongoose.models.EVData || mongoose.model("EVData", dataSchema);

export default CarCustomer;