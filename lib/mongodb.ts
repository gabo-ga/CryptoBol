import { MongoClient, type Document } from "mongodb"

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable")
}

const options = {}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  const client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function getMongoClient() {
  return clientPromise
}

export async function getMongoCollection<T extends Document = Document>(
  collectionName: string,
  dbName = process.env.MONGODB_DB || "cryptobol"
) {
  const client = await getMongoClient()
  return client.db(dbName).collection<T>(collectionName)
}

export default clientPromise
