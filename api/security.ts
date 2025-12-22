// Add this function to the existing security.ts file

// Recursive validation and sanitization for nested objects
export function validateAndSanitizeInput(data: any, maxDepth: number = 10, currentDepth: number = 0): any {
  // Prevent infinite recursion
  if (currentDepth > maxDepth) {
    throw new Error('Input validation depth exceeded');
  }

  // Handle null/undefined
  if (data === null || data === undefined) {
    return data;
  }

  // Handle strings - sanitize and validate
  if (typeof data === 'string') {
    const sanitized = sanitizeHtml(data);
    
    // Validate length
    if (sanitized.length > 10000) { // Reasonable max length for any field
      throw new Error('Input too long');
    }
    
    return sanitized;
  }

  // Handle numbers - validate range
  if (typeof data === 'number') {
    if (!isFinite(data) || data > Number.MAX_SAFE_INTEGER || data < Number.MIN_SAFE_INTEGER) {
      throw new Error('Invalid number');
    }
    return data;
  }

  // Handle booleans - return as-is
  if (typeof data === 'boolean') {
    return data;
  }

  // Handle arrays - recursively validate each element
  if (Array.isArray(data)) {
    if (data.length > 1000) { // Reasonable max array size
      throw new Error('Array too large');
    }
    
    return data.map(item => validateAndSanitizeInput(item, maxDepth, currentDepth + 1));
  }

  // Handle objects - recursively validate each property
  if (typeof data === 'object') {
    const keys = Object.keys(data);
    if (keys.length > 100) { // Reasonable max object properties
      throw new Error('Object too large');
    }

    const sanitized: any = {};
    for (const key of keys) {
      // Validate property names
      if (typeof key !== 'string' || key.length > 100 || !/^[a-zA-Z0-9_-]+$/.test(key)) {
        throw new Error('Invalid property name');
      }
      
      sanitized[key] = validateAndSanitizeInput(data[key], maxDepth, currentDepth + 1);
    }
    return sanitized;
  }

  // Reject any other types
  throw new Error('Invalid input type');
}

// Whitelist validation for specific endpoints
export function validateContactForm(data: any): { name: string; email: string; message: string } {
  // Define expected structure
  const expectedFields = ['name', 'email', 'message'];
  
  // Check for unexpected fields
  const unexpectedFields = Object.keys(data).filter(key => !expectedFields.includes(key));
  if (unexpectedFields.length > 0) {
    throw new Error('Unexpected fields in request');
  }

  // Validate each field
  const { name, email, message } = data;
  
  if (typeof name !== 'string' || name.length < 1 || name.length > 100) {
    throw new Error('Invalid name');
  }
  
  if (typeof email !== 'string' || !validateEmail(email)) {
    throw new Error('Invalid email');
  }
  
  if (typeof message !== 'string' || message.length < 10 || message.length > 2000) {
    throw new Error('Invalid message');
  }

  return {
    name: sanitizeHtml(name.trim()),
    email: email.trim().toLowerCase(),
    message: sanitizeHtml(message.trim())
  };
}