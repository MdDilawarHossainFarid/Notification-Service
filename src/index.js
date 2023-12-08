const express = require("express");
const amqplib = require("amqplib");

async function connectQueue() {
  try {
    const connection = await amqplib.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertQueue("noti-queue");
    channel.consume("noti-queue", async (data) => {
      const object = JSON.parse(`${Buffer.from(data.content)}`);
      // const object = JSON.parse(Buffer.from(data).toString());
      await EmailService.sendEmail(
        "md.d.h.farid12@gmail.com",
        object.recepientEmail,
        object.subject,
        object.text
      );
      channel.ack(data);
    });
  } catch (error) {}
}

const { ServerConfig } = require("./config");
const apiRoutes = require("./routes");

// const mailsender = require("./config/email-config");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, async () => {
  console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
  await connectQueue();
  console.log("queue is up");
  // try {
  //   const response = await mailsender.sendMail({
  //     from: ServerConfig.GMAIL_EMAIL,
  //     to: "xyz@gmail.com",
  //     subject: "Is the service working ? now as well",
  //     text: "Yes it is working",
  //   });
  //   console.log(response);
  // } catch (error) {
  //   console.log(error);
  // }
});
