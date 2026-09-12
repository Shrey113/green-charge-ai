import mongoose from "mongoose";

// MongoDB Atlas Cloud Connection String (green_charge_ai)
const ATLAS_URI =
  "mongodb+srv://pushparajsinhwork_db_user:wc51sEMXOgLZAe9v@cluster0.5uottmj.mongodb.net/green_charge_ai?appName=Cluster0";

let lastConnectionError = null;
let lastConnectedTime = null;
let isConnecting = false;

/**
 * Mask password in Mongo URI for safe display in UI/logs
 */
export const getMaskedUri = (uri) => {
  if (!uri) return "";
  return uri.replace(/:\/\/([^:@]+):([^@]+)@/, "://$1:••••••••@");
};

/**
 * Get the currently configured MongoDB URI (always Atlas cloud database)
 */
export const getConfiguredUri = () => {
  return (
    process.env.CONNECTION_STRING ||
    process.env.DATABASE_URL ||
    process.env.MONGO_URI ||
    ATLAS_URI
  );
};

/**
 * Connect to MongoDB with timeout and friendly error recording
 */
export const connectDB = async () => {
  const uri = getConfiguredUri();
  const maskedUri = getMaskedUri(uri);
  const hasPlaceholder = uri.includes("YOUR_NEW_PASSWORD");

  if (isConnecting) {
    console.log("[MongoDB] Connection already in progress...");
    return;
  }

  isConnecting = true;
  lastConnectionError = null;

  try {
    console.log(`[MongoDB] Attempting connection to: ${maskedUri}`);

    if (hasPlaceholder) {
      console.warn(
        "⚠️  [MongoDB Notice] 'YOUR_NEW_PASSWORD' detected in server/.env. Replace with your actual Atlas password."
      );
    }

    // Set connection options for fast failover if credentials are bad
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });

    lastConnectedTime = new Date();
    lastConnectionError = null;
    isConnecting = false;
    console.log(`✅ [MongoDB] Connected successfully to database: '${mongoose.connection.name}' on ${mongoose.connection.host}`);
  } catch (error) {
    isConnecting = false;
    lastConnectionError = error.message || String(error);
    console.error("❌ [MongoDB] Connection failed:", lastConnectionError);
    if (lastConnectionError.includes("bad auth") || hasPlaceholder) {
      console.error(
        "👉 [MongoDB Tip] Replace 'YOUR_NEW_PASSWORD' in server/.env with your real MongoDB Atlas user password."
      );
    }
  }
};

/**
 * Reconnect to MongoDB (e.g. after user updates .env password)
 */
export const reconnectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  } catch (err) {
    console.warn("[MongoDB] Disconnect error before reconnect:", err.message);
  }
  return connectDB();
};

/**
 * Return detailed connection health and status
 */
export const getConnectionState = () => {
  const uri = getConfiguredUri();
  const readyState = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const stateMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  return {
    connected: readyState === 1,
    readyState,
    readyStateText: stateMap[readyState] || "unknown",
    host: mongoose.connection.host || null,
    port: mongoose.connection.port || null,
    databaseName: mongoose.connection.name || null,
    maskedUri: getMaskedUri(uri),
    hasPlaceholderPassword: uri.includes("YOUR_NEW_PASSWORD"),
    lastConnectedTime,
    lastError: lastConnectionError,
  };
};

/**
 * List all collections and their document counts in the current database
 */
export const listCollectionsWithCounts = async () => {
  if (mongoose.connection.readyState !== 1) {
    return {
      connected: false,
      collections: [],
      error: lastConnectionError || "Database is not connected",
    };
  }

  try {
    const db = mongoose.connection.db;
    const rawCollections = await db.listCollections().toArray();

    const collections = await Promise.all(
      rawCollections.map(async (col) => {
        const count = await db.collection(col.name).countDocuments();
        return {
          name: col.name,
          type: col.type || "collection",
          count,
        };
      })
    );

    return {
      connected: true,
      databaseName: mongoose.connection.name,
      collections,
    };
  } catch (err) {
    return {
      connected: true,
      databaseName: mongoose.connection.name,
      collections: [],
      error: err.message,
    };
  }
};

/**
 * Fetch documents from a collection with pagination
 */
export const getCollectionDocuments = async (collectionName, options = {}) => {
  if (mongoose.connection.readyState !== 1) {
    return {
      connected: false,
      documents: [],
      total: 0,
      error: lastConnectionError || "Database is not connected",
    };
  }

  const { limit = 25, page = 1, filter = {} } = options;
  const skip = (Math.max(1, page) - 1) * limit;

  try {
    const db = mongoose.connection.db;
    const collection = db.collection(collectionName);

    const total = await collection.countDocuments(filter);
    const documents = await collection
      .find(filter)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(Number(limit))
      .toArray();

    return {
      connected: true,
      collection: collectionName,
      total,
      page: Number(page),
      limit: Number(limit),
      documents,
    };
  } catch (err) {
    return {
      connected: true,
      collection: collectionName,
      total: 0,
      documents: [],
      error: err.message,
    };
  }
};

/**
 * Insert a document into a collection (useful for testing live writes)
 */
export const insertDocument = async (collectionName, doc) => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error(lastConnectionError || "Database is not connected");
  }

  const db = mongoose.connection.db;
  const collection = db.collection(collectionName);
  const result = await collection.insertOne({
    ...doc,
    createdAt: doc.createdAt || new Date(),
  });

  return {
    acknowledged: result.acknowledged,
    insertedId: result.insertedId,
  };
};