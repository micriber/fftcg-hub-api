module.exports = [{
    "name": "default",
    "type": "postgres",
    "host": process.env.DB_HOST,
    "port": 5432,
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DB ,
    "synchronize": false,
    "logging": false,
    "entities": [
        "src/entities/**/*.ts"
    ],
    "migrations": [
        "src/migrations/**/*.ts"
    ],
    "subscribers": [
        "src/subscribers/**/*.ts"
    ],
    "cli": {
        "entitiesDir": "src/entities",
        "migrationsDir": "src/migrations",
        "subscribersDir": "src/subscribers"
    }
}, {
    "name": "test",
    "type": "postgres",
    "host": process.env.DB_HOST,
    "port": 5432,
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DB_TEST,
    "entities": [
        "src/entities/**/*.ts"
    ],
    "subscribers": [
        "src/subscribers/**/*.ts"
    ]
}];
