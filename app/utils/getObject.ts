import { HttpRequest } from "@aws-sdk/protocol-http";
import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { parseUrl } from "@aws-sdk/url-parser";
import { Sha256 } from "@aws-crypto/sha256-browser";
import { Hash } from "@aws-sdk/hash-node";
import { formatUrl } from "@aws-sdk/util-format-url";
import { s3Credentials } from "./s3Client";

/**
 * Generates a presigned URL for accessing an object in an S3 bucket.
 * @param key The key (path) of the object in the bucket.
 * @returns A promise that resolves to the presigned URL.
 */

export const getObjectUrl = async (key: string): Promise<string> => {
  const s3ObjectUrl = parseUrl(
    `https://${s3Credentials.bucket}.s3.${s3Credentials.region}.amazonaws.com/${key}`
  );

  const presigner = new S3RequestPresigner({
    credentials: {
      accessKeyId: s3Credentials.accessKeyId,
      secretAccessKey: s3Credentials.secretAccessKey,
    },
    region: s3Credentials.region,
    sha256: Hash.bind(null, "sha256"), // In Node.js
    // sha256: Sha256 // In browsers
  });

  const url = await presigner.presign(new HttpRequest(s3ObjectUrl));
  const presignedUrl = formatUrl(url);
  return presignedUrl;
};

export default getObjectUrl;
