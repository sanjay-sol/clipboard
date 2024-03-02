# cl1p.vercel.app

cl1p.vercel.app is an Internet Clipboard application that allows users to seamlessly upload and share various types of data, including text, files, and images. The application leverages AWS S3 for storing objects securely. Presigned URLs are used to grant temporary access to shared content, ensuring enhanced security and privacy. Users can create new clips or view existing ones via dynamically generated URLs.

## Application Architecture

![Screenshot 2024-03-02 at 4 58 49 PM](https://github.com/sanjay-sol/aws-s3/assets/114111046/ba36d36b-a171-48fe-8c09-56bcf0e40d95)

## Features

- Upload and share text, files, and images effortlessly.
- Secure storage and access of data using AWS S3.
- Utilizes presigned URLs for temporary access to shared content.
- Simple and intuitive user interface.

## Usage

To run the application locally:

1. Clone this repository.
2. Install dependencies using `npm install`.
3. Set up environment variables for AWS credentials and configurations.
4. Run the application using `npm run dev`.

## Technologies Used

- AWS S3 for secure storage of objects.
- React.js for the frontend user interface.
- Next.js for server-side rendering and routing.
- Axios for making HTTP requests.
- JSZip for file compression.

## Related Documentation

- [AWS S3 Documentation](https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/)
- [React.js Documentation](https://react.dev/learn)
- [Next.js Documentation](https://nextjs.org/docs)
- [JSZip Documentation](https://www.npmjs.com/package/jszip)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

