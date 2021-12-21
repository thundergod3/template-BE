import transporter from "../app/configs/transporter.js";

const sendingMail = async (fromEmail, userEmail, subject, sentData) => {
  try {
    const mailOption = {
      from: fromEmail,
      to: userEmail,
      subject: subject,
      html: sentData,
    };
    const sendMailStatus = await transporter.sendMail(mailOption);
    return sendMailStatus;
  } catch (error) {
    throw new Error("Sending Email Problem !!!");
  }
};

export default sendingMail;
