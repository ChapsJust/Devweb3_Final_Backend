process.on("uncaughtException", (e) => {
  console.error("=== UNCAUGHT EXCEPTION ===");
  console.error(e);
  process.exit(1);
});

process.on("unhandledRejection", (e) => {
  console.error("=== UNHANDLED REJECTION ===");
  console.error(e);
  process.exit(1);
});

console.log("=== STARTING APP ===");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MONGODB:", process.env.MONGODB ? "SET" : "NOT SET");
console.log("JWTSECRET:", process.env.JWTSECRET ? "SET" : "NOT SET");
console.log("PORT:", process.env.PORT);

require("./config.js");
console.log("=== CONFIG LOADED ===");

require("./dist/index.js");
console.log("=== INDEX LOADED ===");
