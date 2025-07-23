// var express = require('express');
// var path = require('path');
// var http = require('http');
// var bodyParser = require('body-parser');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// const goalRoutes = require('./server/routes/goals')
// const todoRoutes = require('./server/routes/todos')
// var mongoose = require('mongoose');

// var index = require('./server/routes/app');

// var app = express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//   extended: false
// }));
// app.use(cookieParser());

// app.use(logger('dev'));

// // Add support for CORS
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   );
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'GET, POST, PATCH, PUT, DELETE, OPTIONS'
//   );
//   next();
// });

// // Tell express to use the specified director as the
// // root directory for your web site
// app.use(express.static(path.join(__dirname, 'dist/dreamit')));


// app.use('/', index);
// app.use('/goals', goalRoutes);
// app.use('/todos', todoRoutes);

// // Tell express to map all other non-defined routes back to the index page
// app.get('/*splat', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist/dreamit/browser/index.html'));
// });

// // Define the port address and tell express to use this port
// const port = process.env.PORT || '3000';
// app.set('port', port);

// // Create HTTP server.
// const server = http.createServer(app);

// // Tell the server to start listening on the provided port
// server.listen(port, function() {
//   console.log('API running on localhost:'+port)
// });

// mongoose.connect('mongodb+srv://miztivite:EstoEsUnaPrueba123@cluster0.au5zo.mongodb.net/DreamIt')
//   .then(() => {
//     console.log('Connected to database!');
//   })
//   .catch((err) => {
//     console.log('Connection failed: ' + err);
//   });


// filepath: /Users/mitzivite/Documents/School/7mo Semester/Full-Stack Development/final/DreamIt/DreamIt/server.js


const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

// Initialize express app
const app = express();

// Import routes
const goalRoutes = require('./server/routes/goals');
const appRoutes = require('./server/routes/app');

// MongoDB Atlas connection string
const mongoDbUrl = 'mongodb+srv://miztivite:EstoEsUnaPrueba123@cluster0.au5zo.mongodb.net/DreamIt';

// Middleware configuration
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// CORS Configuration
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

// Static files configuration - Updated path for Angular 17
app.use(express.static(path.join(__dirname, 'dist/dream-it/browser')));

// Routes configuration
app.use('/', appRoutes);
app.use('/goals', goalRoutes);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/dream-it/browser/index.html'));
});

// Port configuration
const port = process.env.PORT || '3000';
app.set('port', port);

// Create HTTP server
const server = http.createServer(app);

// MongoDB connection without deprecated options
mongoose.connect(mongoDbUrl)
.then(async () => {
    console.log('✅ Connected to MongoDB Atlas!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📚 Collections:', collections.map(c => c.name));
    
    // Check if Goals collection is empty
    const count = await mongoose.connection.db.collection('Goals').countDocuments();
    console.log('🎯 Number of goals in database:', count);

    // If empty, add a test goal
    if (count === 0) {
        const Goal = require('./server/models/goal.model');
        const testGoal = new Goal({
            title: 'Test Goal',
            description: 'This is a test goal',
            dueDate: new Date(),
            completed: false
        });

        await testGoal.save();
        console.log('✨ Test goal created successfully');
    }

    server.listen(port, () => {
        console.log('🚀 Server running on http://localhost:' + port);
    });
})
.catch(error => {
    console.error('❌ MongoDB Atlas Connection Error:', error);
    process.exit(1);
});
// Handle process termination
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: err.message
  });
});

module.exports = app;