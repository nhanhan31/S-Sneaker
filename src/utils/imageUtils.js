export const parseImageArray = (imageData) => {
  if (!imageData) return [];
  
  // Nếu đã là array, return luôn
  if (Array.isArray(imageData)) {
    return imageData.filter(img => img && typeof img === 'string');
  }
  
  // Nếu là string, try parse JSON
  if (typeof imageData === 'string') {
    // Nếu là string đơn (không phải JSON array)
    if (!imageData.startsWith('[')) {
      return [imageData];
    }
    
    // Parse JSON array
    try {
      const parsed = JSON.parse(imageData);
      return Array.isArray(parsed) 
        ? parsed.filter(img => img && typeof img === 'string')
        : [];
    } catch (error) {
      console.error('Error parsing image array:', error);
      // Fallback: try to extract URLs manually
      const urlRegex = /https?:\/\/[^\s",\]]+/g;
      const matches = imageData.match(urlRegex);
      return matches || [];
    }
  }
  
  return [];
};