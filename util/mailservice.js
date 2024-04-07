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
exports.sendEmail=async(receiver)=>{
    const receivers=[
        {
            email:receiver,
        },
    ]

    await tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: 'This is Testing Email Service',
        textContent: `You are the user of testing {{params.email}} Email Service`,
        params:{
            email: 'Brevo',
        },
        htmlContent: `<h1>Hello Brevo from HTML h1 Tag</h1>
                      <a href="https://www.google.com/">Google</a>`,
    }).then(console.log("Email Sent Successfully!"))
    .catch(err=>console.log(err));
}