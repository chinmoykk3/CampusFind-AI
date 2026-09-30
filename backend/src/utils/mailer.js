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

const sendResolutionReport = async (email, itemName, itemType, status) => {
    console.log(`\n================================`);
    console.log(`🔔 CASE DISPATCH REPORT INTERCEPTED`);
    console.log(`To: ${email}`);
    console.log(`Subject: CampusFind Case Status Update - ${itemName}`);
    console.log(`Body: Your report for a ${itemType} item '${itemName}' has been marked as ${status.toUpperCase()}.`);
    console.log(`================================\n`);

    try {
        if (process.env.SMTP_USER) {
            await transporter.sendMail({
                from: `"CampusFind AI" <${process.env.SMTP_USER}>`,
                to: email,
                subject: `CampusFind Case Status Update - ${itemName}`,
                html: `
                    <div style="font-family: 'Playfair Display', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                        <h2 style="color: ${status === 'resolved' ? '#10b981' : '#f43f5e'};">Case ${status.toUpperCase()}</h2>
                        <p>Hello,</p>
                        <p>This is an automated notification from the CampusFind AI engine. The status for your reported ${itemType} item has been updated.</p>
                        
                        <div style="background: #f8fafc; padding: 20px; margin: 20px 0; border-left: 4px solid ${status === 'resolved' ? '#10b981' : '#f43f5e'};">
                            <strong>Item:</strong> ${itemName}<br/>
                            <strong>New Status:</strong> ${status.toUpperCase()}
                        </div>
                        
                        <p style="color: #64748b; font-size: 14px;">If this item was successfully recovered, we are glad we could help! If this was dismissed or closed unexpectedly, please review your dashboard or contact administration.</p>
                        <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #94a3b8;">CampusFind Telemetry System © 2026</p>
                    </div>
                `
            });
        }
    } catch (error) {
        console.error("Mail dispatch failed. Continuing with console fallback.");
    }
};

const sendMatchHandoffEmail = async (lostData, foundData) => {
    const emails = [lostData.email, foundData.email].filter(Boolean);

    console.log(`\n================================`);
    console.log(`🤝 MATCH CONFIRMATION & HANDOFF PROTOCOL`);
    console.log(`To: ${emails.join(", ")}`);
    console.log(`Subject: CampusFind AI - Official Match Handshake!`);
    console.log(`Body: A confirmed match has been established between '${lostData.itemName}' and '${foundData.itemName}'. Please arrange a handoff.`);
    console.log(`================================\n`);

    try {
        if (process.env.SMTP_USER) {
            await transporter.sendMail({
                from: `"CampusFind AI" <${process.env.SMTP_USER}>`,
                to: emails,
                subject: `CampusFind AI - Official Match Handshake!`,
                html: `
                    <div style="font-family: 'Playfair Display', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                        <h2 style="color: #4f46e5; text-align: center;">System Match Confirmed!</h2>
                        <p>Hello,</p>
                        <p>Our semantic AI engine and administrative team have officially confirmed a match between two active reports. An impending handoff is now authorized.</p>
                        
                        <div style="background: #f8fafc; padding: 20px; margin: 20px 0; border-left: 4px solid #6366f1;">
                            <h3 style="margin-top: 0; color: #334155;">Lost Report Details</h3>
                            <strong>Item:</strong> ${lostData.itemName}<br/>
                            <strong>Reporter Contact:</strong> ${lostData.email}
                            
                            <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 15px 0;" />
                            
                            <h3 style="margin-top: 0; color: #334155;">Found Report Details</h3>
                            <strong>Item:</strong> ${foundData.itemName}<br/>
                            <strong>Reporter Contact:</strong> ${foundData.email}
                        </div>
                        
                        <p style="color: #64748b; font-size: 14px;">Both parties receive this exact email. Please use the contact details provided above to communicate directly and arrange a secure physical exchange of the item.</p>
                        <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #94a3b8;">CampusFind Telemetry System © 2026</p>
                    </div>
                `
            });
        }
    } catch (error) {
        console.error("Handoff mail dispatch failed. Continuing with console fallback.");
    }
};

const sendPasswordResetOTP = async (email, otp) => {
    console.log(`\n================================`);
    console.log(`🔑 PASSWORD RESET OTP INTERCEPTED`);
    console.log(`To: ${email}`);
    console.log(`Subject: Reset Your CampusFind Password`);
    console.log(`Body: Your password reset OTP is: ${otp}\n(It expires in 10 minutes)`);
    console.log(`================================\n`);

    try {
        if (process.env.SMTP_USER) {
            await transporter.sendMail({
                from: `"CampusFind AI" <${process.env.SMTP_USER}>`,
                to: email,
                subject: "Reset Your CampusFind Password",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                        <h2 style="color: #4f46e5;">Password Reset Request</h2>
                        <p>We received a request to reset your CampusFind account password. Use the One-Time Password below to proceed. If you did not request this, you can safely ignore this email.</p>

                        <div style="background: #f1f5f9; padding: 20px; font-size: 28px; font-weight: bold; letter-spacing: 8px; text-align: center; border-radius: 8px; margin: 24px 0;">
                            ${otp}
                        </div>

                        <p style="color: #64748b; font-size: 13px;">This OTP expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
                        <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #94a3b8;">CampusFind AI © 2026</p>
                    </div>
                `
            });
        }
    } catch (error) {
        console.error("Password reset mail dispatch failed. OTP logged to console.");
    }
};

const sendAIMatchAlertEmail = async (email, lostItemName, foundItemName, score) => {
    const percentage = Math.round(score * 100);
    console.log(`\n================================`);
    console.log(`🤖 AI MATCH ALERT INTERCEPTED`);
    console.log(`To: ${email}`);
    console.log(`Subject: CampusFind AI - Potential Match Found! (${percentage}%)`);
    console.log(`Body: We found a potential match for '${lostItemName}'.`);
    console.log(`================================\n`);

    try {
        if (process.env.SMTP_USER) {
            await transporter.sendMail({
                from: `"CampusFind AI" <${process.env.SMTP_USER}>`,
                to: email,
                subject: `High Probability Match for your ${lostItemName} (${percentage}%)`,
                html: `
                    <div style="font-family: 'Playfair Display', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                        <h2 style="color: #4f46e5; text-align: center;">Potential Match Detected</h2>
                        <p>Hello,</p>
                        <p>Our multimodal AI engine just completed a scan and discovered a <strong>${percentage}% similar</strong> item reported on campus that heavily overlaps with your missing item.</p>
                        
                        <div style="background: #f8fafc; padding: 20px; margin: 20px 0; border-left: 4px solid #6366f1;">
                            <strong>Your Lost Item:</strong> ${lostItemName}<br/>
                            <strong>Matched Item:</strong> ${foundItemName}<br/>
                            <strong>Confidence Score:</strong> ${percentage}%
                        </div>
                        
                        <p style="color: #64748b; font-size: 14px;">Please login to your CampusFind Dashboard immediately to review the image, exact location radius, and semantic similarity breakdowns.</p>
                        
                        <a href="http://localhost:5173/dashboard" style="display:inline-block; padding: 12px 24px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 15px;">Review Match Dashboard</a>

                        <p style="text-align: center; margin-top: 40px; font-size: 12px; color: #94a3b8;">CampusFind Telemetry System © 2026</p>
                    </div>
                `
            });
        }
    } catch (error) {
        console.error("AI Match mail dispatch failed. Continuing with console fallback.", error.message);
    }
};

module.exports = {
    sendOTP,
    sendResolutionReport,
    sendMatchHandoffEmail,
    sendPasswordResetOTP,
    sendAIMatchAlertEmail
};
