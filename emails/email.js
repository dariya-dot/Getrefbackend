const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const dotenv=require('dotenv')
dotenv.config()

const sesClient = new SESClient({
    region: 'ap-south-1', 
    credentials: {
      accessKeyId:process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    },
  });


  ////otp for user resister
  const sendOTP = async (user) => {
    const params = {
      Source: 'dariyakondapalli@gmail.com', 
      Destination: {
        ToAddresses: [user.email],
      },
      Message: {
        Subject: { Data: 'Refer-Me otp verification' },
        Body:{
            Html:{
                Charset: "UTF-8",
                Data:`
                 <!DOCTYPE html>
                 <html>
                        <body style="font-family: Arial, sans-serif; text-align: center; background-color: #f8f9fa; padding: 20px;">
                            <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                                  <h2 style="color: #007BFF;">Welcome to Refer-Me, ${user.name}!</h2>
                                <p>Thank you for signing up for the <strong>Refer-Me Job Referral Portal</strong>. We're excited to help you connect with job opportunities through trusted referrals.</p>
                                
                                <h3 style="color: #28a745;">Verify Your Email</h3>
                                <p>Use the OTP below to verify your email address and activate your account:</p>
                                <h1 style="color: #ff5722; letter-spacing: 5px;">${user.otp}</h1>
                                <p>This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
                                
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
            },
            Text: {  
                Data: `Welcome to Refer-Me, ${user.name}!\n\nYour OTP is: ${user.otp}\n\nThis OTP is valid for 10 minutes. Please do not share it with anyone.\n\nBest Regards,\nRefer-Me Team`
            }
        }
      },
    };
  
    try {
      const command = new SendEmailCommand(params);
      const response = await sesClient.send(command);
      console.log('Email sent successfully:', response);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };


  ////otp for refer  resister
  
  const sendOTPToReferrer = async (referrer) => {
    const params = {
      Source: 'dariyakondapalli@gmail.com', 
      Destination: {
        ToAddresses: [referrer.email],
      },
      Message: {
        Subject: { Data: 'Refer-Me OTP Verification for Referrer' },
        Body:{
            Html:{
                Charset: "UTF-8",
                Data: `
                 <!DOCTYPE html>
                 <html>
                        <body style="font-family: Arial, sans-serif; text-align: center; background-color: #f8f9fa; padding: 20px;">
                            <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                                  <h2 style="color: #007BFF;">Welcome to Refer-Me, ${referrer.name}!</h2>
                                <p>Thank you for signing up as a **Job Referrer** on the <strong>Refer-Me Job Referral Portal</strong>. You are now part of a trusted network helping job seekers find opportunities.</p>
                                
                                <h3 style="color: #28a745;">Verify Your Email</h3>
                                <p>Use the OTP below to verify your email address and activate your account:</p>
                                <h1 style="color: #ff5722; letter-spacing: 5px;">${referrer.otp}</h1>
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
            },
            Text: {  
                Data: `Welcome to Refer-Me, ${referrer.name}!\n\nYour OTP is: ${referrer.otp}\n\nThis OTP is valid for 10 minutes. Please do not share it with anyone.\n\nBest Regards,\nRefer-Me Team`
            }
        }
      },
    };
  
    try {
      const command = new SendEmailCommand(params);
      const response = await sesClient.send(command);
      console.log('Referrer OTP email sent successfully:', response);
    } catch (error) {
      console.error('Error sending referrer email:', error);
    }
};

module.exports={sendOTP,sendOTPToReferrer}






