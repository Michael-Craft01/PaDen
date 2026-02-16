
require('dotenv').config();

console.log('Checking Twilio Env Vars:');
console.log('SID:', process.env.Twilio_Account_Sid ? '✅ Present' : '❌ Missing');
console.log('Token:', process.env.Twilio_Auth_Token ? '✅ Present' : '❌ Missing');
console.log('Phone:', process.env.Twilio_Phone_Number ? '✅ Present' : '❌ Missing');
