const nodemailer = require("nodemailer");

// Create a generic transporter (Replace with actual SMTP credentials globally as needed)
// For local testing, this will just print the email to the console if it fails to bind.
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || "dummy@gmail.com",
        pass: process.env.SMTP_PASS || "dummypass"
    }
});

const sendOTP = async (email, otp) => {
    // Console fallback mechanism - crucial so the user can literally "see" the OTP in the terminal
    // even if they haven't explicitly set up an app password for Gmail yet!
    console.log(`\n================================`);
    console.log(`🔔 NEW EMAIL INTERCEPTED`);
    console.log(`To: ${email}`);
    console.log(`Subject: Verify Your CampusFind Account`);
    console.log(`Body: Your OTP is: ${otp}\n(It expires in 10 minutes)`);
    console.log(`================================\n`);

    try {
        if (process.env.SMTP_USER) {
            await transporter.sendMail({
                from: `"CampusFind AI" <${process.env.SMTP_USER}>`,
                to: email,
                subject: "Verify Your CampusFind Account",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #4f46e5;">Welcome to CampusFind AI</h2>
                        <p>You recently registered for an account. Please use the following One-Time Password sequence to verify your identity.</p>
                        
                        <div style="background: #f1f5f9; padding: 20px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; border-radius: 8px;">
                            ${otp}
                        </div>
                        
                        <p style="color: #64748b; font-size: 12px; margin-top: 20px;">This OTP will physically expire in 10 minutes.</p>
                    </div>
                `
            });
        }
    } catch (error) {
        console.error("Mail dispatch failed (expected if SMTP not configured). Continuing with console fallback.");
    }
};

module.exports = {
    sendOTP
};
