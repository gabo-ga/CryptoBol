import { MongoClient, type Document } from "mongodb"

const uri = process.env.MONGODB_URI
const options = {}

declare global {
  // Allow reuse of the client during hot reloads in dev
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

let clientPromise: Promise<MongoClient> | null = null

export const isMongoConfigured = Boolean(uri)

function initClientPromise() {
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable")
  }

  if (clientPromise) return clientPromise

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

  return clientPromise
}

export async function getMongoClient() {
  return initClientPromise()
}

export async function getMongoCollection<T extends Document = Document>(
  collectionName: string,
  dbName = process.env.MONGODB_DB || "cryptobol"
) {
  const client = await getMongoClient()
  return client.db(dbName).collection<T>(collectionName)
}
