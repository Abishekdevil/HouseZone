import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import categoryContentStyles from "../../styles/categoryContentStyles";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Step1Address from "./Step1Address";
import Step3PaymentImages from "./Step3PaymentImages";
import { handleStep1InputChange } from "./logic/step1Logic";
import { handleImageSelect, handleRemoveImage } from "./logic/step3Logic";
import { handleNext, handlePrevious } from "./logic/navigationLogic";

const BaseForm = ({
  title,
  step2Component: Step2Component,
  initialFormData,
  validationFunction,
  successMessage,
  navigationTarget,
  category
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { role } = route.params || { role: "Owner" };

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);

  const handleStep1Change = handleStep1InputChange(formData, setFormData);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleImageSelection = handleImageSelect(formData, setFormData);
  const handleImageRemoval = handleRemoveImage(formData, setFormData);

  // VALIDATIONS
  const validateStep1 = () => {
    if (
      !formData.name ||
      !formData.doorNo ||
      !formData.street ||
      !formData.pincode ||
      !formData.area ||
      !formData.city ||
      !formData.contactNo
    ) {
      Alert.alert("Validation Error", "Please fill in all required fields in Step 1");
      return false;
    }
    return true;
  };

  const validateStep2 = () => true;

  const validateStep3 = () => {
    if (!formData.advanceAmount || !formData.rentAmount) {
      Alert.alert("Validation Error", "Please fill in all required fields in Step 3");
      return false;
    }

    const images = formData.images || [];
    if (images.length < 4) {
      Alert.alert("Validation Error", "Please add at least 4 images of your property");
      return false;
    }
    return true;
  };

  // SAVE STEP 1 TO DB
  const handleSaveStep1 = async () => {
    if (!validateStep1()) return;

    if (category === "residential") {
      try {
        const step1Data = {
          name: formData.name,
          doorNo: formData.doorNo,
          street: formData.street,
          pincode: formData.pincode,
          area: formData.area,
          city: formData.city,
          contactNo: formData.contactNo
        };

        const { saveResidentialStep1 } = await import("../../screens/residential/logic/api");
        const response = await saveResidentialStep1(step1Data);

        setFormData({
          ...formData,
          residentialId: response.id
        });
      } catch (error) {
        Alert.alert("Error", "Failed to save step 1 data: " + error.message);
      }
    }
  };

  // FINAL SUBMIT
  const handleFormSubmit = async () => {
    if (!validateStep1()) return setStep(1);

    if (validationFunction) {
      const isValid = validationFunction(formData);
      if (!isValid) return setStep(2);
    } else {
      if (!validateStep2()) return setStep(2);
    }

    if (!validateStep3()) return setStep(3);

    if (category === "residential") {
      try {
        // STEP 1
        const step1Data = {
          name: formData.name,
          doorNo: formData.doorNo,
          street: formData.street,
          pincode: formData.pincode,
          area: formData.area,
          city: formData.city,
          contactNo: formData.contactNo
        };

        const { saveResidentialStep1 } = await import("../../screens/residential/logic/api");
        const step1Response = await saveResidentialStep1(step1Data);
        const roNo = step1Response.id;

        // STEP 2
        const step2Data = {
          roNo,
          facingDirection: formData.facingDirection,
          hallLength: formData.hallLength,
          hallBreadth: formData.hallBreadth,
          noOfBedrooms: formData.noOfBedrooms,
          kitchenLength: formData.kitchenLength,
          kitchenBreadth: formData.kitchenBreadth,
          noOfBathrooms: formData.noOfBathrooms,
          bathroom1Type: formData.bathroom1Type,
          floorNo: formData.floorNo,
          bedrooms: []
        };

        const numBedrooms = parseInt(formData.noOfBedrooms);
        if (numBedrooms >= 1)
          step2Data.bedrooms.push({
            number: 1,
            length: formData.bedroom1Length,
            breadth: formData.bedroom1Breadth
          });
        if (numBedrooms >= 2)
          step2Data.bedrooms.push({
            number: 2,
            length: formData.bedroom2Length,
            breadth: formData.bedroom2Breadth
          });
        if (numBedrooms >= 3)
          step2Data.bedrooms.push({
            number: 3,
            length: formData.bedroom3Length,
            breadth: formData.bedroom3Breadth
          });

        const { saveResidentialStep2 } = await import("../../screens/residential/logic/api");
        await saveResidentialStep2(step2Data);

        // STEP 3
        const step3Data = {
          roNo,
          advanceAmount: formData.advanceAmount,
          monthlyRent: formData.rentAmount
        };

        const { saveResidentialStep3 } = await import("../../screens/residential/logic/api");
        await saveResidentialStep3(step3Data);

        Alert.alert("Success", successMessage, [
          {
            text: "OK",
            onPress: () => navigation.navigate(navigationTarget, { role: "Owner" })
          }
        ]);
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    }
  };

  const handleNextStep = () => handleNext(step, setStep, () => {});
  const handlePrevStep = () => handlePrevious(step, setStep);

  return (
    <View style={categoryContentStyles.container}>
      <Header />

      <View style={categoryContentStyles.progressContainer}>
        <Text style={categoryContentStyles.progressText}>Step {step} of 3</Text>
      </View>

      <View style={[categoryContentStyles.content, { paddingHorizontal: 20, width: "100%" }]}>
        {step === 1 && (
          <Step1Address formData={formData} handleInputChange={handleStep1Change} />
        )}
        {step === 2 && (
          <Step2Component formData={formData} handleInputChange={handleInputChange} />
        )}
        {step === 3 && (
          <Step3PaymentImages
            formData={formData}
            handleInputChange={handleInputChange}
            handleImageSelect={handleImageSelection}
            handleRemoveImage={handleImageRemoval}
          />
        )}

        <View style={categoryContentStyles.buttonRow}>
          {step > 1 && (
            <TouchableOpacity
              style={[categoryContentStyles.button, categoryContentStyles.cancelButton]}
              onPress={handlePrevStep}
            >
              <Text style={categoryContentStyles.buttonText}>Back</Text>
            </TouchableOpacity>
          )}

          {step === 1 && (
            <TouchableOpacity
              style={[categoryContentStyles.button, categoryContentStyles.primaryButton]}
              onPress={handleSaveStep1}
            >
              <Text style={categoryContentStyles.buttonText}>Save</Text>
            </TouchableOpacity>
          )}

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            style={[categoryContentStyles.button, categoryContentStyles.primaryButton]}
            onPress={step < 3 ? handleNextStep : handleFormSubmit}
          >
            <Text style={categoryContentStyles.buttonText}>
              {step < 3 ? "Next" : "Submit"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Footer />
    </View>
  );
};

export default BaseForm;
