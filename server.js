const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const app = express();

// Middleware for parsing JSON and URL-encoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (e.g., HTML, CSS)
app.use(express.static("public"));

// Serve the "thankyou.html" file after receiving data
app.get("/thankyou", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "thankyou.html"));
});

let tokens;

// OAuth2 credentials
const CLIENT_ID = "525005874471-u0qigisa8ggi6sl9e64e7pa61b9bgi97.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";

// Load tokens from a file or initialize an empty object
try {
    tokens = JSON.parse(fs.readFileSync("tokens.json"));
} catch (error) {
    tokens = {};
}

// Create a new OAuth2 client
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Set the Gmail OAuth2 scope
const SCOPES = ["https://mail.google.com/"];

// Get an OAuth2 URL to authorize the application
app.get("/auth", (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
    });
    res.redirect(authUrl);
});

// Callback route after authorization
app.get("/oauth2callback", async (req, res) => {
    const code = req.query.code;
    try {
        const { tokens: receivedTokens } = await oAuth2Client.getToken(code);
        tokens = receivedTokens; // Assign tokens to the variable

        // Save tokens to a file for future use
        fs.writeFileSync("tokens.json", JSON.stringify(tokens));

        // Extract form data
        const { name, email, message } = req.query;

        // Create a transporter object for sending email using nodemailer
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                type: "OAuth2",
                user: "masoodhussainr8@gmail.com", // Replace with your Gmail email address
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: tokens.refresh_token,
                accessToken: tokens.access_token,
            },
        });

        // Email content
        const mailOptions = {
            from: email,  // Replace with your Gmail email address
            to: "masoodhussainr8@gmail.com",
            subject: "New Contact Form Submission",
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                res.status(500).send("Error sending email");
            } else {
                console.log("Email sent: " + info.response);
                res.redirect("/thankyou"); // Redirect to the thank you page
            }
        });
    } catch (error) {
        console.error("OAuth2 error:", error);
        res.status(500).send("OAuth2 error");
    }
});

// Handle POST requests to the "/submit" endpoint
app.post("/submit", async (req, res) => {
    try {
        // Extract form data from the request body
        const { name, email, message } = req.body;

        // Create a transporter object for sending email using nodemailer
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                type: "OAuth2",
                user: "masoodhussainr8@gmail.com", // Replace with your Gmail email address
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: tokens.refresh_token,
                accessToken: tokens.access_token,
            },
        });

        // Email content
        const mailOptions = {
            from: email,  // Replace with your Gmail email address
            to: "masoodhussainr8@gmail.com",
            subject: "New Contact Form Submission",
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                res.status(500).send("Error sending email");
            } else {
                console.log("Email sent: " + info.response);
                res.redirect("/thankyou"); // Redirect to the thank you page
            }
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error submitting the form");
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
