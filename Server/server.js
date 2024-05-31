const app = require('./app'); // app.js'den içe aktarıldı

if (process.env.NODE_ENV === 'development') {
  console.log("Running in development mode");
  // Development-specific code
  const PORT = process.env.PORT || 3000; // Default to 3000 in development
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} else {
  console.log("Running in production mode");
  // Production-specific code
  app.listen(() => {
    console.log("Server is running");
  });
}
