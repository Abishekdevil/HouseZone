import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import categoryContentStyles from '../../styles/categoryContentStyles';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Step1Address from './Step1Address';
import Step2Details from './Step2Details';
import Step3PaymentImages from './Step3PaymentImages';
import { validateAllFields } from './validation';

export default function AddHouse() {
  const navigation = useNavigation();
  const route = useRoute();
  const { role } = route.params || { role: "Owner" };

  // State for form steps
  const [step, setStep] = useState(1);
  
  // State for form data
  const [formData, setFormData] = useState({
    // Step 1: Address Information
    name: "",
    doorNo: "",
    street: "",
    pincode: "",
    city: "",
    contactNo: "",
    
    // Step 2: House Details
    facingDirection: "North",
    hallLength: "",
    hallBreadth: "",
    hallTotalSqft: "",
    noOfBedrooms: "1",
    bedroom1Size: "",
    bedroom2Size: "",
    kitchenSize: "",
    noOfBathrooms: "1",
    bathroom1Type: "Western",
    bathroom2Type: "Western",
    floorNo: "Ground",
    
    // Step 3: Payment Details and Images
    advanceAmount: "",
    rentAmount: "",
    images: [], // Array to hold image URIs (minimum 6 required)
  });

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Handle image selection (placeholder function)
  const handleImageSelect = (index) => {
    // In a real app, this would open the image picker
    // For now, we'll just simulate adding an image
    const newImages = [...formData.images];
    if (index < newImages.length) {
      // Replace existing image
      newImages[index] = "https://via.placeholder.com/150?text=Updated+" + (index + 1);
    } else {
      // Add new image
      newImages.push("https://via.placeholder.com/150?text=Image+" + (newImages.length + 1));
    }
    setFormData({
      ...formData,
      images: newImages
    });
  };

  // Handle image removal
  const handleRemoveImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({
      ...formData,
      images: newImages
    });
  };

  // Handle next step
  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Submit form when on step 3
      handleSubmit();
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate all required fields on submit
    if (!validateAllFields(formData)) {
      Alert.alert("Validation Error", "Please fill in all required fields and upload minimum 6 images");
      return;
    }
    
    // Here you would typically send the data to your backend
    Alert.alert(
      "Success",
      "House details added successfully!",
      [
        {
          text: "OK",
          onPress: () => navigation.navigate("Residential", { role: "Owner" })
        }
      ]
    );
  };

  // Render step 1: Address Information
  const renderStep1 = () => (
    <Step1Address 
      formData={formData} 
      handleInputChange={handleInputChange} 
    />
  );

  // Render step 2: House Details
  const renderStep2 = () => (
    <Step2Details 
      formData={formData} 
      handleInputChange={handleInputChange} 
    />
  );

  // Render step 3: Payment Details and Images
  const renderStep3 = () => (
    <Step3PaymentImages 
      formData={formData} 
      handleInputChange={handleInputChange} 
      handleImageSelect={handleImageSelect}
      handleRemoveImage={handleRemoveImage}
    />
  );

  return (
    <View style={categoryContentStyles.container}>
      <Header />
      
      {/* Progress Indicator */}
      <View style={categoryContentStyles.progressContainer}>
        <Text style={categoryContentStyles.progressText}>Step {step} of 3</Text>
      </View>
      
      {/* CONTENT */}
      <View style={[categoryContentStyles.content, { paddingHorizontal: 20, width: '100%' }]}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        
        {/* Navigation Buttons */}
        <View style={categoryContentStyles.buttonRow}>
          {step > 1 && (
            <TouchableOpacity 
              style={[categoryContentStyles.button, categoryContentStyles.secondaryButton]} 
              onPress={handlePrevious}
            >
              <Text style={categoryContentStyles.buttonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[categoryContentStyles.button, categoryContentStyles.primaryButton]} 
            onPress={handleNext}
          >
            <Text style={categoryContentStyles.buttonText}>{step < 3 ? "Next" : "Submit"}</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Footer />
    </View>
  );
}