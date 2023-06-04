const express = require('express');
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

app.post("/send", async (req, res) => {
    try {
        const { sender, receiver, subject, data } = req.body;
        // Create a transporter
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: sender.mail,
                pass: sender.password,
            }
        });

        const info = await transporter.sendMail({
            from: `"${sender.name}" <${sender.mail}>`,
            to: receiver,
            subject: subject,
            html: data,
        });

        let result = (info.accepted.length > 0) ? true : false;

        if (result)
            res.status(200).json({
                type: "success",
                message: "Mail sent successfully"
            });
    } catch (err) {
        res.status(500).json({
            type: "error",
            message: err.message.includes("Invalid login") ? "Invalid sender credentials" : err.message
        })
    }
});

app.listen(port, () => {
    console.log(`Server running`);
});

module.exports = app;