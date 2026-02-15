// ########################################
// ########## SETUP

// Express
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = 37545;

// Database
const db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars'); // Import express-handlebars engine
app.engine('.hbs', engine({ extname: '.hbs' })); // Create instance of handlebars
app.set('view engine', '.hbs'); // Use handlebars engine for *.hbs files.

// ########################################
// ########## ROUTE HANDLERS

// READ ROUTES
app.get('/', async function (req, res) {
    try {
        res.render('home'); // Render the home.hbs file
    } catch (error) {
        console.error('Error rendering page:', error);
        // Send a generic error message to the browser
        res.status(500).send('An error occurred while rendering the page.');
    }
});

app.get('/Movies', async function (req, res) {
    try {
        // Create and execute our queries
        const movieQuery = `SELECT movieID, title, genre, duration 
                FROM Movies ORDER BY title ASC`;
                
        const [movie] = await db.query(movieQuery);

        // Render the bsg-people.hbs file, and also send the renderer
        //  an object that contains our bsg_people and bsg_homeworld information
        res.render('Movies/Movies', { movie: movie });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/Screens', async function (req, res) {
    try {
        // Create and execute our queries
        const screensQuery = `SELECT screenID, screenNumber, seatingCapacity 
                FROM Screens ORDER BY seatingCapacity DESC`;

        const [screen] = await db.query(screensQuery);

        // Render the bsg-people.hbs file, and also send the renderer
        //  an object that contains our bsg_people and bsg_homeworld information
        res.render('Screens/Screens', { screen: screen });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/Customers', async function (req, res) {
    try {
        // Create and execute our queries
        const customersQuery = `SELECT customerID, name, email 
                FROM Customers ORDER BY name ASC`;

        const [customer] = await db.query(customersQuery);

        // Render the bsg-people.hbs file, and also send the renderer
        //  an object that contains our bsg_people and bsg_homeworld information
        res.render('Customers/Customers', { customer: customer });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/Showtimes', async function (req, res) {
    try {
        // Create and execute our queries
        const showtimesQuery = `SELECT showtimeID, showDate, startTime, 
                Movies.title AS movieTitle, Screens.screenNumber AS screenNumber 
                FROM Showtimes 
                    JOIN Movies ON Showtimes.movieID = Movies.movieID 
                    JOIN Screens on Showtimes.screenID = Screens.screenID 
                ORDER BY showDate, startTime ASC`;
        const movieDropdown = `SELECT * FROM Movies ORDER BY title ASC`;
        const screenDropdown = `SELECT * FROM Screens ORDER BY screenID ASC`;
        
        const [movieList] = await db.query(movieDropdown);
        const [screenList] = await db.query(screenDropdown);
        const [showtime] = await db.query(showtimesQuery);

        // Render the bsg-people.hbs file, and also send the renderer
        //  an object that contains our bsg_people and bsg_homeworld information
        res.render('Showtimes/Showtimes', { showtime:showtime, movieList:movieList, screenList:screenList });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/Tickets', async function (req, res) {
    try {
        // Create and execute our queries
        const ticketQuery = `SELECT ticketID, purchaseDate,ticketPrice, 
                CONCAT(Movies.title,' - ', Showtimes.showDate,' ',Showtimes.startTime) AS showtimeLabel, 
                Customers.name AS customerName 
                FROM Tickets 
                    JOIN Showtimes ON Tickets.showtimeID = Showtimes.showtimeID 
                    JOIN Movies ON Showtimes.movieID = Movies.movieID 
                    JOIN Customers ON Tickets.customerID = Customers.customerID 
                ORDER BY Customers.name ASC, purchaseDate DESC`;
        const showtimeDropdown = `SELECT showtimeID, CONCAT(Movies.title,' - ', showDate,' ',startTime) AS showtimeLabel
                FROM Showtimes JOIN Movies on Showtimes.movieID = Movies.movieID
                ORDER BY showdate, showtimeLabel, startTime ASC;`;
        const customerDropdown = `SELECT * FROM Customers ORDER BY name;`;

        const [ticket] = await db.query(ticketQuery);
        const [showtime] = await db.query(showtimeDropdown);
        const [customer] = await db.query(customerDropdown);

        // Render the bsg-people.hbs file, and also send the renderer
        //  an object that contains our bsg_people and bsg_homeworld information
        res.render('Tickets/Tickets', { ticket: ticket, showtime:showtime, customer:customer});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/EditScreen', async function (req, res){
try {
        res.render('Screens/EditScreen', { });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/EditCustomer', async function (req, res){
try {
        res.render('Customers/EditCustomer', { });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/EditShowtime', async function (req, res){
try {
        const movieDropdown = `SELECT * FROM Movies ORDER BY title ASC`;
        const screenDropdown = `SELECT * FROM Screens ORDER BY screenID ASC`;

        const [movieList] = await db.query(movieDropdown);
        const [screenList] = await db.query(screenDropdown);

        res.render('Showtimes/EditShowtime', { movieList:movieList, screenList:screenList});
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/EditTicket', async function (req, res){
try {
        const showtimeDropdown = `SELECT showtimeID, CONCAT(Movies.title,' - ', showDate,' ',startTime) AS showtimeLabel
                FROM Showtimes JOIN Movies on Showtimes.movieID = Movies.movieID
                ORDER BY showdate, showtimeLabel, startTime ASC;`;
        const customerDropdown = `SELECT * FROM Customers ORDER BY name;`;
       
        const [movieList] = await db.query(showtimeDropdown);
        const [customerList] = await db.query(customerDropdown);

        res.render('Tickets/EditTicket', { movieList:movieList, customerList:customerList });
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log(
        'Express started on http://localhost:' +
            PORT +
            '; press Ctrl-C to terminate.'
    );
});