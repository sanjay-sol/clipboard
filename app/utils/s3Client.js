import { S3Client } from "@aws-sdk/client-s3";


const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  },
});

const s3Credentials = {
  bucket: process.env.REACT_APP_AWS_BUCKET,
  region: process.env.REACT_APP_AWS_REGION,
};


export { s3Client , s3Credentials };
