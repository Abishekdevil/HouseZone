import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import categoryContentStyles from '../../../styles/categoryContentStyles';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

const TenantDetails = () => {
  const navigation = useNavigation();
  const [tenantData, setTenantData] = useState({
    name: '',
    job: '',
    salary: '',
    nativePlace: '',
    mobileNumber: '',
    alternateNumber: ''
  });

  const handleInputChange = (field, value) => {
    setTenantData({
      ...tenantData,
      [field]: value
    });
  };

  const handleSubmit = () => {
    // Validation
    if (!tenantData.name || !tenantData.job || !tenantData.salary || 
        !tenantData.nativePlace || !tenantData.mobileNumber) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    // Validate salary is a number
    if (isNaN(tenantData.salary) || parseFloat(tenantData.salary) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid salary amount');
      return;
    }

    // Validate mobile numbers
    if (isNaN(tenantData.mobileNumber) || tenantData.mobileNumber.length < 10) {
      Alert.alert('Validation Error', 'Please enter a valid mobile number');
      return;
    }

    if (tenantData.alternateNumber && (isNaN(tenantData.alternateNumber) || tenantData.alternateNumber.length < 10)) {
      Alert.alert('Validation Error', 'Please enter a valid alternate number');
      return;
    }

    // In a real app, you would save this data to your backend here
    console.log('Tenant Data:', tenantData);
    
    // Show success message
    Alert.alert(
      'Success',
      'Tenant details submitted successfully!',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  return (
    <View style={categoryContentStyles.container}>
      <Header />
      
      <View style={categoryContentStyles.content}>
        <ScrollView style={{ width: '100%' }}>
          <View style={categoryContentStyles.formContainer}>
            <Text style={categoryContentStyles.formTitle}>Tenant Details</Text>
            
            <Text style={categoryContentStyles.label}>Name *</Text>
            <TextInput
              style={categoryContentStyles.input}
              placeholder="Full Name"
              value={tenantData.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />
            
            <Text style={categoryContentStyles.label}>Job *</Text>
            <TextInput
              style={categoryContentStyles.input}
              placeholder="Occupation"
              value={tenantData.job}
              onChangeText={(value) => handleInputChange('job', value)}
            />
            
            <Text style={categoryContentStyles.label}>Salary per Month *</Text>
            <TextInput
              style={categoryContentStyles.input}
              placeholder="Monthly Salary"
              value={tenantData.salary}
              onChangeText={(value) => handleInputChange('salary', value)}
              keyboardType="numeric"
            />
            
            <Text style={categoryContentStyles.label}>Native Place *</Text>
            <TextInput
              style={categoryContentStyles.input}
              placeholder="Native Place"
              value={tenantData.nativePlace}
              onChangeText={(value) => handleInputChange('nativePlace', value)}
            />
            
            <Text style={categoryContentStyles.label}>Mobile Number *</Text>
            <TextInput
              style={categoryContentStyles.input}
              placeholder="Mobile Number"
              value={tenantData.mobileNumber}
              onChangeText={(value) => handleInputChange('mobileNumber', value)}
              keyboardType="phone-pad"
            />
            
            <Text style={categoryContentStyles.label}>Alternate Number</Text>
            <TextInput
              style={categoryContentStyles.input}
              placeholder="Alternate Number"
              value={tenantData.alternateNumber}
              onChangeText={(value) => handleInputChange('alternateNumber', value)}
              keyboardType="phone-pad"
            />
          </View>
        </ScrollView>
        
        <View style={categoryContentStyles.buttonRow}>
          <TouchableOpacity 
            style={[categoryContentStyles.button, categoryContentStyles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={categoryContentStyles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[categoryContentStyles.button, categoryContentStyles.primaryButton]}
            onPress={handleSubmit}
          >
            <Text style={categoryContentStyles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Footer />
    </View>
  );
};

export default TenantDetails;