import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: process.env.AWS_REGION // Ensure AWS_REGION is correctly set in your environment variables
});

export const getPresignedUrl = async ({ userId, filename, contentType }) => {
    console.log('getPresignedUrl called with:', { userId, filename, contentType });
    const bucketName = process.env.S3_BUCKET_NAME; // Ensure S3_BUCKET_NAME is set in your environment variables
    const objectKey = `uploads/${userId}/${Date.now()}-${filename}`;

    console.log('Using S3 bucket:', bucketName);
    console.log('Generated object key:', objectKey);

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
        ContentType: contentType
    });

    console.log('Generating signed URL for object key:', objectKey);
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    console.log('Generated signed URL:', signedUrl);

    return { url: signedUrl, key: objectKey };
};

export const deleteFromS3 = async (bucketName, objectKey) => {
    if (!objectKey) {
        throw new Error("Object key is undefined, cannot delete from S3.");
    }

    try {
        const deleteCommand = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: objectKey,
        });
        console.log('Deleting object from S3 with key:', objectKey);
        const response = await s3Client.send(deleteCommand);
        console.log('Deleted object from S3:', response);
        return response; // The response can be used for logging or confirmation
    } catch (error) {
        console.error("Error deleting object from S3:", error);
        throw error; // Rethrow the error to handle it in the calling function
    }
};




