const express = require("express");
const router = express.Router();

const mysql2 = require("mysql2/promise");
const pool = require("../utils/dbConfig");

//default route : "/%%route_name%%"

const tableName = "%%table_name%%";

