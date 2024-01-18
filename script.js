function encryptFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const fileContent = e.target.result;
      const encryptedContent = encryptAES(fileContent);

      // Replace the original file content with the encrypted content
      fileInput.files[0] = new File([encryptedContent], file.name, { type: file.type });
    };

    reader.readAsArrayBuffer(file);
  }
}

function encryptAES(data) {
  const secretKey = 10071611; // Replace with your secret key
  const encrypted = CryptoJS.AES.encrypt(data, secretKey);
  return encrypted.toString();
}

  