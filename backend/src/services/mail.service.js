import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GOOGLE_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.log(`error connecting to email server :`, err);
  } else {
    console.log(`email server is ready to send message`);
  }
});

export const sendEmail = async ({to, subject, text=null, html}) => {
  try {
    const info =await transporter.sendMail({
      from: process.env.GOOGLE_USER,
      to: to,
      subject: subject,
      text: text,
      html: html,
    });

    console.log(info);

    console.log("______________________");
    console.log("message sent : %s", info.messageId);
    console.log("______________________");

    console.log("preview url : %s ", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.log("error sending email : ", error);
  }
};

export default transporter;
