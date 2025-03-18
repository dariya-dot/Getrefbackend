
const dotenv=require('dotenv')
dotenv.config()



require("dotenv").config();

const sendOTPToUser = async (user) => {
    try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "api-key": process.env.BREVO_API_KEY, // Brevo API Key from .env
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sender: { name: "GetReference", email: "dariyakondapalli@gmail.com" }, // Replace with your Brevo sender email
                to: [{ email: user.email }],
                subject:  'Refer-Me otp verification',
                htmlContent: `<!DOCTYPE html>
<html>
    <body style="font-family: Arial, sans-serif; text-align: center; background-color: #f8f9fa; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #007BFF;">Welcome to Refer-Me, ${user.name}!</h2>
            <p>Thank you for signing up for the <strong>Refer-Me Job Referral Portal</strong>. We're excited to help you connect with job opportunities through trusted referrals.</p>
            
            <h3 style="color: #28a745;">Verify Your Email</h3>
            <p>Use the OTP below to verify your email address and activate your account:</p>
            
            <div style="background: #ffebee; padding: 15px; display: inline-block; border-radius: 5px;">
                <h1 style="color: #ff5722; letter-spacing: 5px; margin: 0;">${user.otp}</h1>
            </div>
            
            <p style="margin-top: 10px;">This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
            
            <h3>What’s Next?</h3>
            <ul style="text-align: left; padding-left: 20px;">
                <li>Complete your profile by adding your education, skills, and experience.</li>
                <li>Upload your resume to increase your chances of getting referrals.</li>
                <li>Start applying for job referrals and connect with professionals.</li>
            </ul>

            <p style="margin-top: 20px;">If you did not sign up for Refer-Me, please ignore this email.</p>
            <hr>
            <p style="color: #777;">Best Regards,<br><strong>Refer-Me Team</strong></p>
        </div>
    </body>
</html>
`
            })
        });

        const data = await response.json();

        response.ok
            ? console.log("✅ Email sent successfully:", data)
            : console.error("❌ Error sending email:", data);
    } catch (error) {
        console.error("❌ Fetch error:", error.message);
    }
};




const useResetLink = async (user,resetLink) => {
  try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
              "api-key": process.env.BREVO_API_KEY, // Use environment variable for security
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              sender: { name: "GetReference", email: "dariyakondapalli@gmail.com" }, // Replace with your Brevo sender email
              to: [{ email: user.email }],
              subject: 'Refer-Me OTP Verification',
              htmlContent: `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px; text-align: center; }
        .container { max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); }
        h2 { color: #ff5722; }
        .button { background-color: #ff5722; color: #fff; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block; margin: 10px 0; }
        .footer { color: #777; font-size: 12px; margin-top: 20px; }
        .link { word-break: break-word; color: #007BFF; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Password Reset Request</h2>
        <p>Hi ${user.name},</p>
        <p>We received a request to reset your password for your <strong>GetReference</strong> account.</p>
        
        <h3>Click the button below to reset your password:</h3>
        <a href="${resetLink}" class="button">Reset Password</a>
      
        <p>If the button doesn’t work, copy and paste the following link into your browser:</p>
        <p class="link"><a href="${resetLink}">${resetLink}</a></p>
      
        <p>This reset link is valid for <strong>1 hour</strong>. If you didn’t request this, you can safely ignore this email.</p>
      
        <hr>
        <p class="footer">For any queries, contact our support team at <a href="mailto:support@getreference.site">support@getreference.site</a></p>
    </div>
</body>
</html>`
          })
      });

      const data = await response.json();

      if (response.ok) {
          console.log("✅ Email sent successfully:", data);
      } else {
          console.error("❌ Error sending email:", data);
      }
  } catch (error) {
      console.error("❌ Fetch error:", error.message);
  }
};




const sendOTPToRef = async (ref) => {
    try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "api-key": process.env.BREVO_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sender: { name: "GetReference", email: "dariyakondapalli@gmail.com" }, // Replace with your Brevo sender email
                to: [{ email: ref.email }],
                subject:  'Refer-Me otp verification',
                htmlContent: `<!DOCTYPE html>
                 <html>
                        <body style="font-family: Arial, sans-serif; text-align: center; background-color: #f8f9fa; padding: 20px;">
                            <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                                  <h2 style="color: #007BFF;">Welcome to Refer-Me, ${ref.name}!</h2>
                                <p>Thank you for signing up as a **Job Referrer** on the <strong>Refer-Me Job Referral Portal</strong>. You are now part of a trusted network helping job seekers find opportunities.</p>
                                
                                <h3 style="color: #28a745;">Verify Your Email</h3>
                                <p>Use the OTP below to verify your email address and activate your account:</p>
                                <h1 style="color: #ff5722; letter-spacing: 5px;">${ref.otp}</h1>
                                <p>This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
                                
                                <h3>What’s Next?</h3>
                                <ul style="text-align: left; padding-left: 20px;">
                                    <li>Complete your profile by adding your company details.</li>
                                    <li>Start posting job openings for referral opportunities.</li>
                                    <li>Refer deserving job seekers and earn referral rewards.</li>
                                </ul>

                                <p style="margin-top: 20px;">If you did not sign up for Refer-Me, please ignore this email.</p>
                                <hr>
                                <p style="color: #777;">Best Regards,<br><strong>Refer-Me Team</strong></p>
                            </div>
                        </body>
                    </html>
`
            })
        });

        const data = await response.json();

        response.ok
            ? console.log("✅ Email sent successfully:", data)
            : console.error("❌ Error sending email:", data);
    } catch (error) {
        console.error("❌ Fetch error:", error.message);
    }
};



const refResetLink = async (ref,resetLink) => {
    try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "api-key": process.env.BREVO_API_KEY, // Use environment variable for security
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sender: { name: "GetReference", email: "dariyakondapalli@gmail.com" }, // Replace with your Brevo sender email
                to: [{ email: ref.email }],
                subject: 'Refer-Me OTP Verification',
                htmlContent: `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px; text-align: center; }
        .container { max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); }
        h2 { color: #007BFF; }
        .button { background-color: #007BFF; color: #fff; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block; margin: 10px 0; }
        .footer { color: #777; font-size: 12px; margin-top: 20px; }
        .link { word-break: break-word; color: #007BFF; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Password Reset Request</h2>
        <p>Hi ${ref.name},</p>
        <p>We received a request to reset your password for your <strong>Job Referrer</strong> account on <strong>GetReference</strong>.</p>
        
        <h3>Click the button below to reset your password:</h3>
        <a href="${resetLink}" class="button">Reset Password</a>
      
        <p>If the button doesn’t work, copy and paste the following link into your browser:</p>
        <p class="link"><a href="${resetLink}">${resetLink}</a></p>
      
        <p>This reset link is valid for <strong>1 hour</strong>. If you didn’t request this, you can safely ignore this email.</p>
      
        <hr>
        <p class="footer">For any queries, contact our support team at <a href="mailto:support@getreference.site">support@getreference.site</a></p>
    </div>
</body>
</html>
`
            })
        });
  
        const data = await response.json();
  
        if (response.ok) {
            console.log("✅ Email sent successfully:", data);
        } else {
            console.error("❌ Error sending email:", data);
        }
    } catch (error) {
        console.error("❌ Fetch error:", error.message);
    }
  };
  
  
  
  

module.exports={sendOTPToRef,sendOTPToUser,useResetLink,refResetLink}






