const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const Sqlite3Database = require('./databaseController');

const SunglassesAtNiteDatabase = function(){
    this.name = 'sunglasses@nite DB';
    this.filename = 'sunglass.db';
    this.directory = path.join(__dirname, '..', '..', 'public', 'db', 'sunglass.db');
};
SunglassesAtNiteDatabase.prototype.connect = function(){
        const db = new sqlite3.Database((this.directory), error => {
            if (error) console.error(error);
            console.info(`Connected to ${this.name}`);
        });
        this.database = db;
};
SunglassesAtNiteDatabase.prototype.disconnect = function(){
        this.database.close(error => {
            if (error) console.error(error);
            console.info(`${this.name} connection closed`)
        });
        delete this.database;
};
SunglassesAtNiteDatabase.prototype.transactionStart = async function(transaction, ...args){
        this.connect();
        try {
            return await transaction(...args);
        } catch (error) {
            throw error;
        } finally {
            this.disconnect();
        }
};
SunglassesAtNiteDatabase.prototype.query = async function(table){
        const query = `SELECT * FROM ${table[0]}`;
        return new Promise ((resolve, reject) => {
            SunglassesAtNiteDatabase.database.all(`SELECT * FROM ${table}`, (error, rows) => {
                if (error){
                    reject(console.error(error));
                } else {
                    console.info(query, '...Successful!');
                    resolve(rows);
                }
            });
        });
};
SunglassesAtNiteDatabase.prototype.command = async function(command){
        return new Promise((resolve, reject) => {
            SunglassesAtNiteDatabase.database.run(command, error => {
                if (error){
                    reject(console.error(error));
                } else {
                    console.info(command, '...Successful!');
                    resolve();
                }
            })
        })
};

const sgn = new SunglassesAtNiteDatabase();
console.log(sgn.transactionStart(sgn.query, 'tags'));