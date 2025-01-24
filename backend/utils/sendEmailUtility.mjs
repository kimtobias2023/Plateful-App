import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
    region: 'us-west-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

export const sendEmailUtility = async (to, subject, emailContent) => {
    const params = {
        Source: process.env.SENDER_EMAIL,
        Destination: { ToAddresses: [to] },
        Message: {
            Subject: {
                Charset: 'UTF-8',
                Data: subject,
            },
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: emailContent,
                },
            },
        },
    };

    try {
        const response = await sesClient.send(new SendEmailCommand(params));
        console.log("Email sent successfully:", response);
        return response;
    } catch (error) {
        console.error("Failed to send email:", error);
        throw error;
    }
};



