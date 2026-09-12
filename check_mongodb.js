import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load server .env first, then root .env
dotenv.config({ path: path.join(__dirname, "server", ".env") });
dotenv.config({ path: path.join(__dirname, ".env") });

const CONNECTION_STRING =
  process.env.CONNECTION_STRING ||
  process.env.DATABASE_URL ||
  process.env.MONGO_URI ||
  "";

async function checkMongoDB() {
  if (!CONNECTION_STRING) {
    console.error("❌ No CONNECTION_STRING or DATABASE_URL found in server/.env");
    return;
  }

  const isPlaceholder = CONNECTION_STRING.includes("YOUR_NEW_PASSWORD");

  console.log("========================================");
  console.log("🔍 GREENCHARGE AI - MONGODB DIAGNOSTICS");
  console.log("========================================");
  console.log("Loaded URI:", CONNECTION_STRING.replace(/:([^:@]+)@/, ":••••••••@"));

  if (isPlaceholder) {
    console.warn("\n⚠️  NOTICE: 'YOUR_NEW_PASSWORD' placeholder detected in CONNECTION_STRING.");
    console.warn("Please update 'YOUR_NEW_PASSWORD' in 'server/.env' with your real MongoDB Atlas password.\n");
  }

  const client = new MongoClient(CONNECTION_STRING, {
    serverSelectionTimeoutMS: 5000,
  });

  try {
    console.log("Connecting to MongoDB Atlas...");
    await client.connect();

    // Test connection ping
    await client.db("admin").command({ ping: 1 });

    console.log("========================================");
    console.log("✅ MONGODB CONNECTED SUCCESSFULLY");
    console.log("========================================");

    // Get databases
    const result = await client.db("admin").admin().listDatabases();

    console.log("\n📁 DATABASES FOUND (" + result.databases.length + "):");

    for (const database of result.databases) {
      console.log(`\n📁 Database: ${database.name}`);

      const db = client.db(database.name);

      const collections = await db.listCollections().toArray();

      if (collections.length === 0) {
        console.log("   └── (No collections found)");
        continue;
      }

      for (const collectionInfo of collections) {
        const collectionName = collectionInfo.name;
        const collection = db.collection(collectionName);

        const count = await collection.countDocuments();

        console.log(`   ├── 📄 ${collectionName} (${count} documents)`);

        // Show first 3 documents
        const documents = await collection.find({}).limit(3).toArray();

        documents.forEach((doc, index) => {
          console.log(`\n      Document ${index + 1}:`);
          console.dir(doc, {
            depth: null,
            colors: true,
          });
        });
      }
    }
  } catch (error) {
    console.error("\n========================================");
    console.error("❌ MONGODB CONNECTION FAILED");
    console.error("========================================");
    console.error("Error Code:", error.code || "N/A");
    console.error("Error Message:", error.message);
    if (error.message && error.message.includes("bad auth")) {
      console.error("\n👉 Action Required: Replace 'YOUR_NEW_PASSWORD' with your real MongoDB Atlas user password in server/.env");
    }
  } finally {
    try {
      await client.close();
    } catch {
      // ignore
    }
  }
}

checkMongoDB();