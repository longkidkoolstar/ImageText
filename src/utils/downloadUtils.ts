/**
 * Utility function to download data as a JSON file
 * @param data The data to download
 * @param filename The name of the file to download
 */
export const downloadAsJson = (data: any, filename: string = 'download.json'): void => {
  // Create a blob with the data
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link element
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Append the link to the body
  document.body.appendChild(link);
  
  // Trigger the download
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
