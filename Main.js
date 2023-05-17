const readlineSync = require('readline-sync');
const fs = require('fs');
const https = require('https');
const http = require('http');

// downlaods from https
async function download_image_https(imageUrl, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);

    https.get(imageUrl, (response) => {
      const totalBytes = parseInt(response.headers['content-length'], 10);
      let receivedBytes = 0;

      response.on('data', (data) => {
        receivedBytes += data.length;
        file.write(data);
        showProgress(receivedBytes, totalBytes);
      });

      response.on('end', () => {
        file.end();
        console.log('Download successful');
        resolve();
      });

      response.on('error', (error) => {
        reject(error);
      });
    });
  });
}

// Downloads from http
async function download_image_http(imageUrl, filePath) {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(filePath);
  
      http.get(imageUrl, (response) => {
        const totalBytes = parseInt(response.headers['content-length'], 10);
        let receivedBytes = 0;
  
        response.on('data', (data) => {
          receivedBytes += data.length;
          file.write(data);
          showProgress(receivedBytes, totalBytes);
        });
  
        response.on('end', () => {
          file.end();
          console.log('Download successfull');
          resolve();
        });
  
        response.on('error', (error) => {
          reject(error);
          console.log('There is a high probability that it is the network or server program restart may be required');
        });
      });
    });
  }
  

function showProgress(received, total) {
  const percentage = (received * 100) / total;
  console.log(`${percentage.toFixed(2)}% | ${received} bytes out of ${total} bytes.`);
}

async function start() {
    try {
      let keep_running = true;
      while (keep_running) {
        // Get the mode from the user
        console.log('1. https:// addresses');
        console.log('2. http:// addresses');
        const mode = parseInt(readlineSync.question('Enter the type of address: '));
        // Get input from user
        const imageUrl = readlineSync.question('Enter image URL: ');
        const imageName = readlineSync.question('Enter image name: ');
        const filePath = `./downloaded-images/${imageName}.jpg`;
        // Download from https address
        if (mode === 1) {
          await download_image_https(imageUrl, filePath);
        }
        // Download from http address
        if (mode === 2) {
          await download_image_http(imageUrl, filePath);
        }
      }
    } catch (error) {
      console.log('ERROR:', error.message);
    }
  }
  

start();

