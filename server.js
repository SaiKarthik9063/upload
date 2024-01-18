const express = require('express');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const CryptoJS = require('crypto-js');

const app = express();
const port = 3000;

const connectionString = 'DefaultEndpointsProtocol=https;AccountName=saikarthik1001;AccountKey=8jlr0wFaJHwzOTh2APa5KTyKTRdrRLANLVmE+bERgqRy6jNsi5OKJAUAcNDCEEyw5N2tUKaOSLKc+AStsLcb9A==;EndpointSuffix=core.windows.net'; // Replace with your Azure Storage connection string
const containerName = 'saikarthik1001'; // Replace with your Azure Storage container name

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static('public'));

app.post('/upload', upload.single('file'), async (req, res) => {
  const originalFileName = req.file.originalname;
  const fileNameInput = req.body.fileName || originalFileName;
  const blobName = fileNameInput;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  try {
    // Encrypt the content before uploading to Azure Blob Storage
    const encryptedContent = encryptAES(req.file.buffer.toString());
    
    // Upload the encrypted content
    await blockBlobClient.upload(encryptedContent, encryptedContent.length);
    
    // Check if the file exists after uploading
    const fileExists = await blockBlobClient.exists();
    
    if (fileExists) {
      const blobUrl = blockBlobClient.url;
      res.send(`File uploaded to Azure Blob Storage successfully. Blob URL: ${blobUrl}`);
    } else {
      res.status(500).send('Error: File not found in Azure Blob Storage after upload');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading file to Azure Blob Storage');
  }
});

function encryptAES(data) {
  const secretKey = 10071611; // Replace with your secret key
  const encrypted = CryptoJS.AES.encrypt(data, secretKey);
  return encrypted.toString();
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
