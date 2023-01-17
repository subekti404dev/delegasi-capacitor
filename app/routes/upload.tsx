import { Alert, AlertIcon, Box, Progress } from '@chakra-ui/react';
import { useState } from 'react';
import * as tus from 'tus-js-client';

export default function Upload() {
  const [progressStatus, setProgressStatus] = useState(0);
  const [isProgress, setProgress] = useState(false);

  function handleUpload(e: any) {
    // Get the selected file from the input element
    var file = e.target.files[0] as File;

    storeFailedUploadInfo(file);

    var fileUrl = URL.createObjectURL(file);
    console.log(fileUrl, 'file url');

    // Create a new tus upload
    var upload = new tus.Upload(file, {
      endpoint: 'http://localhost:5050/files/',
      retryDelays: [0, 3000, 5000, 10000, 20000],
      metadata: {
        filename: file.name,
        filetype: file.type,
      },
      onError: function (error) {
        setProgress(false);
        console.log('Failed because: ' + error);
      },
      onProgress: function (bytesUploaded, bytesTotal) {
        const percentage = (bytesUploaded / bytesTotal) * 100;
        setProgress(true);
        setProgressStatus(percentage);
        console.log(bytesUploaded, bytesTotal, percentage + '%');
      },
      onSuccess: function () {
        setProgress(false);
        console.log('Download %s from %s', upload.file.name, upload.url);
      },
    });

    // Check if there are any previous uploads to continue.
    upload.findPreviousUploads().then(function (previousUploads) {
      // Found previous uploads so we select the first one.
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }

      // Start the upload
      upload.start();
    });
  }

  // Store the metadata of the last failed uploaded file
  function storeFailedUploadInfo(file: File) {
    // Create a metadata object
    const metadata = {
      name: file.name,
      size: file.size,
      timestamp: new Date().toISOString(),
    };

    // Save the metadata to localStorage
    localStorage.setItem('lastFailedUpload', JSON.stringify(metadata));
  }

  // Retrieve the metadata of the last failed uploaded file
  function getLastFailedUpload() {
    const lastFailedUpload = localStorage.getItem('lastFailedUpload');
    if (lastFailedUpload) {
      return JSON.parse(lastFailedUpload);
    } else {
      return null;
    }
  }

  return (
    <div>
      {/* <div>
        {progressStatus}
        <CircularProgress value={progressStatus} color="green.400">
          <CircularProgressLabel>{progressStatus}%</CircularProgressLabel>
        </CircularProgress>
      </div> */}
      {isProgress ? (
        <Box pos="fixed" bottom="0" left="auto" right="auto">
          <Progress colorScheme="blue" size="xs" value={progressStatus} />
          <Alert status="info">
            <AlertIcon />
            Data uploaded to the server. Fire on!
          </Alert>
        </Box>
      ) : null}

      <input type="file" onChange={handleUpload} />
    </div>
  );
}
