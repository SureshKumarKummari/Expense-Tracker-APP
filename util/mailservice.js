const Sib=require('sib-api-v3-sdk');

require('dotenv').config();

const client=Sib.ApiClient.instance

const api=client.authentications['api-key']
api.apiKey=process.env.API_KEY;

const tranEmailApi=new Sib.TransactionalEmailsApi();

const sender={
    email:'sureshk28591@gmail.com',
    name:'Suresh Kumar'//optional
}
exports.sendEmail=async(receiver,link)=>{
    const receivers=[
        {
            email:receiver,
        },
    ]

    await tranEmailApi.sendTransacEmail({
    sender,
    to: receivers,
    subject: 'This is Testing Email Service',
    htmlContent: `<h1>Hello Brevo from HTML h1 Tag</h1>
                  <a href="${link}">Click Here to Reset Password</a>`,
}).then(() => {
    console.log("Email Sent Successfully!");
}).catch((error) => {
    console.error("Error sending email:", error);
});

}
