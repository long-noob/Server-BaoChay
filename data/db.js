const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'BaoChay';
let db;

async function connectDB() {
    if (!db) {
        const client = new MongoClient(url);
        await client.connect();
        db = client.db(dbName);
    }
    return db;
}

async function saveSensorData(data) {
    const db = await connectDB();
    const collection = db.collection('SensorData');
    return await collection.insertOne({
        lastUpdateTime: new Date(),
        smoke_value: data.smoke_value,
        fire_value: data.fire_value,
        pump_state: Boolean(data.pump_state),
        buzzer_state: Boolean(data.buzzer_state)
    });
}

async function getSensorData(page, pageSize) {
    const db = await connectDB();
    const collection = db.collection('SensorData');
    const skip = (page - 1) * pageSize;
    const sensorDataList = await collection.find().sort({ lastUpdateTime: -1 }).skip(skip).limit(pageSize).toArray();
    const totalRecords = await collection.countDocuments();
    const totalPages = Math.ceil(totalRecords / pageSize);
    return { sensorDataList, totalPages };
}

async function getLatestSensorData(limit) {
    const db = await connectDB();
    const collection = db.collection('SensorData');
    const chartData = await collection.find().sort({ lastUpdateTime: -1 }).limit(limit).toArray();
    return chartData.reverse();
}

module.exports = {
    saveSensorData,
    getSensorData,
    getLatestSensorData
};