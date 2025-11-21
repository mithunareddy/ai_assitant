/**
 * Medical form validation utilities
 */

export function validatePersonalInfo(data) {
  const errors = {};
  
  if (!data.name?.trim()) {
    errors.name = 'Name is required';
  }
  
  if (!data.age) {
    errors.age = 'Age is required';
  } else {
    const age = parseInt(data.age);
    if (isNaN(age) || age < 0 || age > 150) {
      errors.age = 'Please enter a valid age between 0 and 150';
    }
  }
  
  if (!data.gender) {
    errors.gender = 'Gender is required';
  }
  
  if (!data.weight?.trim()) {
    errors.weight = 'Weight is required';
  }
  
  if (!data.height?.trim()) {
    errors.height = 'Height is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateMedicalHistory(data) {
  const errors = {};
  
  // All fields are optional for medical history
  // But we can add specific validations if needed
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * BMI calculation utilities
 */
export function calculateBMI(weight, height) {
  try {
    // Extract numeric values from weight and height strings
    const weightMatch = weight.match(/(\d+(?:\.\d+)?)/);
    const heightMatch = height.match(/(\d+(?:\.\d+)?)/);
    
    if (!weightMatch || !heightMatch) {
      return null;
    }
    
    let weightKg = parseFloat(weightMatch[1]);
    let heightCm = parseFloat(heightMatch[1]);
    
    // Convert weight to kg if in lbs
    if (weight.toLowerCase().includes('lb')) {
      weightKg = weightKg * 0.453592;
    }
    
    // Convert height to cm if in feet/inches
    if (height.includes("'") || height.includes('ft')) {
      // Handle feet and inches
      const feetMatch = height.match(/(\d+)(?:'|ft)/);
      const inchesMatch = height.match(/(\d+)(?:"|in)/);
      
      const feet = feetMatch ? parseInt(feetMatch[1]) : 0;
      const inches = inchesMatch ? parseInt(inchesMatch[1]) : 0;
      
      heightCm = (feet * 12 + inches) * 2.54;
    }
    
    // Convert height to meters
    const heightM = heightCm / 100;
    
    // Calculate BMI
    const bmi = weightKg / (heightM * heightM);
    
    return Math.round(bmi * 10) / 10;
  } catch (error) {
    console.error('Error calculating BMI:', error);
    return null;
  }
}

export function getBMICategory(bmi) {
  if (!bmi) return null;
  
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

/**
 * Medical data formatting utilities
 */
export function formatMedicalData(formData) {
  const bmi = calculateBMI(formData.weight, formData.height);
  const bmiCategory = getBMICategory(bmi);
  
  return {
    ...formData,
    calculatedBMI: bmi,
    bmiCategory: bmiCategory
  };
}

/**
 * Image validation for medical uploads
 */
export function validateMedicalImage(file) {
  const errors = [];
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('Only JPEG, PNG, and WebP images are allowed');
  }
  
  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    errors.push('Image size must be less than 10MB');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Medication parsing utilities
 */
export function parseMedicationString(medicationString) {
  if (!medicationString?.trim()) return [];
  
  // Simple parsing - split by line or comma
  const medications = medicationString
    .split(/[,\n]/)
    .map(med => med.trim())
    .filter(med => med.length > 0)
    .map(med => ({
      name: med,
      raw: med
    }));
  
  return medications;
}

/**
 * Emergency detection utilities
 */
export function detectEmergencyKeywords(text) {
  const emergencyKeywords = [
    'chest pain', 'heart attack', 'stroke', 'unconscious', 'bleeding heavily',
    'difficulty breathing', 'shortness of breath', 'severe pain', 'emergency',
    'urgent', 'life threatening', 'overdose', 'poisoning', 'severe allergic reaction',
    'anaphylaxis', 'seizure', 'suicidal', 'suicide', 'self harm'
  ];
  
  const lowerText = text.toLowerCase();
  return emergencyKeywords.some(keyword => lowerText.includes(keyword));
}