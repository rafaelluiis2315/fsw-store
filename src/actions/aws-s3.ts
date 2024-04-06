"use server";

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_BUCKET_NAME;

const s3Client = new S3Client({
    region: region,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    },
});

const uploadImagesToS3 = async (files: File[]): Promise<string[]> => {
    try {
        const objectsUrl: string[] = [];

        for (const file of files) {
            const objectUrl = await uploadImageToS3(file);
            objectsUrl.push(objectUrl);
        }

        return objectsUrl;
    } catch (error) {
        console.error('Erro ao fazer upload de imagens:', error);
        throw error;
    }
};

const uploadImageToS3 = async (file: File): Promise<string> => {
    try {
        const fileContent = await file.arrayBuffer();

        const body = new Uint8Array(fileContent);
        const key = `${Date.now()}_${file.name}`;

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: body,
            ACL: 'public-read',
        });

        const response = await s3Client.send(command);

        const objectUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

        if (response.$metadata.httpStatusCode === 200) {
            return objectUrl;
        } else {
            throw new Error('Falha ao fazer upload de imagem');
        }
    } catch (error) {
        console.error('Erro ao fazer upload de imagem:', error);
        throw error;
    }
};

export {
    uploadImagesToS3,
    uploadImageToS3,
};
