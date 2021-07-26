const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "milosbakmaz5@gmail.com", // generated ethereal user
    pass: "anjamilosstasa1216", // generated ethereal password
  },
});

const sendEmail = async (to, hashedValue) => {
  try {
    await transporter.sendMail({
      from: "milosbakmaz5@gmail.com", // sender address
      to: to, // list of receivers
      subject: "Welcome 👋", // Subject line
      text: "Hello world?", // plain text body
      html: ` <h2 style="text-align: center">
                Please confirm your email.
              </h2>
              <br><br>
              <a href="${process.env.FRONTEND_MAIL_CONFIRMATION}/${hashedValue}" 
                style="text-decoration: none;
                      display: block;
                      padding: 1rem;
                      width: 200px;
                      margin: 0 auto 2rem auto;
                      text-align: center;
                      color: white;
                      background-color: #183059ff;
                      border-radius: 10px";
                      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2)>
                Confirm your email
              </a>
              <p style="text-align: center; font-weight: bold">
                Or verify using this link:
                <a href="${process.env.FRONTEND_MAIL_CONFIRMATION}/${hashedValue}">
                  ${process.env.FRONTEND_MAIL_CONFIRMATION}/${hashedValue}
                </a>
              </p>`, // html body
    });
  } catch (error) {
    throw error;
  }
};

exports.sendEmail = sendEmail;
