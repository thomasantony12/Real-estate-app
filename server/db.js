import pg from "pg";

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "real-estate",
    password: "",
    port: 5432,
});

db.connect();

export default db;
