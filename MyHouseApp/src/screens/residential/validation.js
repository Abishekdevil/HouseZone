// Validation function for final submit
const validateAllFields = (formData) => {
  // Validate Step 1
  if (!formData.name.trim() ||
      !formData.doorNo.trim() ||
      !formData.street.trim() ||
      !formData.pincode.trim() ||
      !formData.city.trim() ||
      !formData.contactNo.trim()) {
    return false;
  }
  
  // Validate Step 2
  if (!formData.hallLength.trim() ||
      !formData.hallBreadth.trim() ||
      !formData.hallTotalSqft.trim() ||
      !formData.kitchenSize.trim()) {
    return false;
  }
  
  // Validate Step 3
  if (!formData.advanceAmount.trim() ||
      !formData.rentAmount.trim() ||
      formData.images.length < 6) { // Minimum 6 images required
    return false;
  }
  
  return true;
};

export { validateAllFields };