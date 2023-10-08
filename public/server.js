const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/thankyou", (req, res) => {
    res.sendFile(path.join(__dirname,"thankyou.html"));
});
const tokens = {
    access_token:"ya29.a0AfB_byBeyQugrLvnIwOAT4vwddjAwcSLQ8If8iHk4rQotnQdXY-GPN_n40oLS0t7BwesTNV-Os0jHWXlkRDeYrYuTjTZA507npDnKaRpVqB2bu9zpNqpe--t-SMunutw2PyWqsdCeArwJurTGqemLlitFa5JL88q2_AYaCgYKASoSARMSFQGOcNnCS_MfDNoXH5REku0tmrgbDQ0171",
    refresh_token: "1//04fWd-5gOhpWiCgYIARAAGAQSNwF-L9Irg7TC24ptA9jOl4LSmTpvkA4-o28-8YM8iXwzSiI0TK9bGjBv_1x99nzxPq7FV7ubivs"
}
const CLIENT_ID = "525005874471-u0qigisa8ggi6sl9e64e7pa61b9bgi97.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials(tokens); 
const SCOPES = ["https://mail.google.com/"];
app.get("/auth", (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
    });
    res.redirect(authUrl);
});
app.get("/oauth2callback", async (req, res) => {
    const code = req.query.code;
    try {
        const { tokens: receivedTokens } = await oAuth2Client.getToken(code);
        tokens = receivedTokens; 
        fs.writeFileSync("tokens.json", JSON.stringify(tokens));
        const { name, email, message } = req.query;
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                type: "OAuth2",
                user: "masoodhussainr8@gmail.com", 
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: tokens.refresh_token,
                accessToken: tokens.access_token,
            },
        });
        const mailOptions = {
            from: email, 
            to: "masoodhussainr8@gmail.com",
            subject: "New Contact Form Submission",
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                res.status(500).send("Error sending email");
            } else {
                console.log("Email sent: " + info.response);
                res.redirect("/thankyou"); 
            }
        });
    } catch (error) {
        console.error("OAuth2 error:", error);
        res.status(500).send("OAuth2 error");
    }
});app.post("/submit", async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                type: "OAuth2",
                user: "masoodhussainr8@gmail.com", 
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: tokens.refresh_token,
                accessToken: tokens.access_token,
            },
        });
        const mailOptions = {
            from: email,  // 
            to: "masoodhussainr8@gmail.com",
            subject: "New Contact Form Submission",
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                res.status(500).send("Error sending email");
            } else {
                console.log("Email sent: " + info.response);
                res.redirect("/thankyou");
            }
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error submitting the form");
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
