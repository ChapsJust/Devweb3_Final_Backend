try {
  require("./config.js");
  require("./dist/index.js");
} catch (e) {
  console.error("=== CRASH ERROR ===");
  console.error(e);
  process.exit(1);
}
