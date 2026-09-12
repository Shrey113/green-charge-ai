import mongoose from "mongoose";

// Schema for 'station_operator' collection (MongoDB Atlas green_charge_ai)
const stationOperatorSchema = new mongoose.Schema(
  {},
  {
    strict: false,
    collection: "station_operator",
  }
);

export const StationOperator =
  mongoose.models.StationOperator ||
  mongoose.model("StationOperator", stationOperatorSchema);

// Schema for 'car_customer' collection (MongoDB Atlas green_charge_ai)
const carCustomerSchema = new mongoose.Schema(
  {},
  {
    strict: false,
    collection: "car_customer",
  }
);

export const CarCustomer =
  mongoose.models.CarCustomer ||
  mongoose.model("CarCustomer", carCustomerSchema);

// Schema for 'customer' collection (MongoDB Atlas green_charge_ai)
const customerSchema = new mongoose.Schema(
  {},
  {
    strict: false,
    collection: "customer",
  }
);

export const Customer =
  mongoose.models.Customer || mongoose.model("Customer", customerSchema);

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

export default StationOperator;