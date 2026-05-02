import 'dotenv/config'
import app from './src/app.js';
import { connectDB } from './src/config/database.js';


const PORT = process.env.PORT || 5000;


// Connect to database
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
