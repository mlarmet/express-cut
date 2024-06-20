require("dotenv-flow").config({ silent: true });

const express = require("express");
const cors = require("cors");

//===============route import=======================
const routes = require("./routes/routes");
//=================================================

const PORT = process.env.PORT || 3001;

const app = express();

app.use(
	cors({
		origin: process.env.ORIGIN_URL,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

for (const route of routes) {
	app.use("/api/" + route.path, require(`./routes/${route.router}`));
}

app.use("/", express.static(__dirname + "/public"));

app.listen(PORT, () => {
	console.log("Server listen on", PORT);
});
