import { Abi } from "abi.js";

const abi = new Abi()
	.get("/", () => "Welcome to Abi.js!")
	.get("/hello(/:name)?", (name = "World") => `Hello ${name}!`);

abi.listen();
