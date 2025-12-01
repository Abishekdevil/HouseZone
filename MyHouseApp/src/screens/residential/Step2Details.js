import React from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { Picker } from '@react-native-picker/picker';
import categoryContentStyles from '../../styles/categoryContentStyles';
import { calculateTotalSqft } from './Step1Address';

const Step2Details = ({ formData, handleInputChange }) => {
  return (
    <ScrollView style={{ width: '100%' }}>
      <View style={categoryContentStyles.formContainer}>
        <Text style={categoryContentStyles.formTitle}>House Details</Text>
        
        {/* Facing Direction */}
        <Text style={categoryContentStyles.label}>Facing Direction *</Text>
        <View style={categoryContentStyles.pickerContainer}>
          <Picker
            selectedValue={formData.facingDirection}
            style={categoryContentStyles.picker}
            onValueChange={(value) => handleInputChange('facingDirection', value)}
          >
            <Picker.Item label="North" value="North" />
            <Picker.Item label="South" value="South" />
            <Picker.Item label="East" value="East" />
            <Picker.Item label="West" value="West" />
          </Picker>
        </View>
        
        {/* Hall Size */}
        <Text style={categoryContentStyles.label}>Hall Size (feet) *</Text>
        <View style={[categoryContentStyles.row, { marginBottom: 15 }]}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={categoryContentStyles.label}>Length *</Text>
            <TextInput
              style={categoryContentStyles.input}
              placeholder="Length"
              value={formData.hallLength}
              onChangeText={(value) => handleInputChange('hallLength', value)}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={categoryContentStyles.label}>Breadth *</Text>
            <TextInput
              style={categoryContentStyles.input}
              placeholder="Breadth"
              value={formData.hallBreadth}
              onChangeText={(value) => handleInputChange('hallBreadth', value)}
              keyboardType="numeric"
            />
          </View>
        </View>
        
        <Text style={categoryContentStyles.label}>Total Square Feet *</Text>
        <TextInput
          style={categoryContentStyles.input}
          placeholder="Total Square Feet"
          value={formData.hallTotalSqft}
          editable={false}
        />
        
        {/* Bedrooms */}
        <Text style={categoryContentStyles.label}>Number of Bedrooms *</Text>
        <View style={categoryContentStyles.pickerContainer}>
          <Picker
            selectedValue={formData.noOfBedrooms}
            style={categoryContentStyles.picker}
            onValueChange={(value) => handleInputChange('noOfBedrooms', value)}
          >
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
            <Picker.Item label="4" value="4" />
          </Picker>
        </View>
        
        {[...Array(parseInt(formData.noOfBedrooms)).keys()].map((index) => (
          <View key={index}>
            <Text style={categoryContentStyles.label}>Bedroom {index + 1} Size (sqft) *</Text>
            <TextInput
              style={categoryContentStyles.input}
              placeholder={`Bedroom ${index + 1} Size (sqft)`}
              value={formData[`bedroom${index + 1}Size`]}
              onChangeText={(value) => handleInputChange(`bedroom${index + 1}Size`, value)}
              keyboardType="numeric"
            />
          </View>
        ))}
        
        {/* Kitchen */}
        <Text style={categoryContentStyles.label}>Kitchen Size (sqft) *</Text>
        <TextInput
          style={categoryContentStyles.input}
          placeholder="Kitchen Size"
          value={formData.kitchenSize}
          onChangeText={(value) => handleInputChange('kitchenSize', value)}
          keyboardType="numeric"
        />
        
        {/* Bathrooms */}
        <Text style={categoryContentStyles.label}>Number of Bathrooms *</Text>
        <View style={categoryContentStyles.pickerContainer}>
          <Picker
            selectedValue={formData.noOfBathrooms}
            style={categoryContentStyles.picker}
            onValueChange={(value) => handleInputChange('noOfBathrooms', value)}
          >
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
            <Picker.Item label="4" value="4" />
          </Picker>
        </View>
        
        {[...Array(parseInt(formData.noOfBathrooms)).keys()].map((index) => (
          <View key={index}>
            <Text style={categoryContentStyles.label}>Bathroom {index + 1} Type *</Text>
            <View style={categoryContentStyles.pickerContainer}>
              <Picker
                selectedValue={formData[`bathroom${index + 1}Type`]}
                style={categoryContentStyles.picker}
                onValueChange={(value) => handleInputChange(`bathroom${index + 1}Type`, value)}
              >
                <Picker.Item label="Western" value="Western" />
                <Picker.Item label="Indian" value="Indian" />
              </Picker>
            </View>
          </View>
        ))}
        
        {/* Floor Number */}
        <Text style={categoryContentStyles.label}>Floor Number *</Text>
        <View style={categoryContentStyles.pickerContainer}>
          <Picker
            selectedValue={formData.floorNo}
            style={categoryContentStyles.picker}
            onValueChange={(value) => handleInputChange('floorNo', value)}
          >
            <Picker.Item label="Ground" value="Ground" />
            <Picker.Item label="First" value="First" />
            <Picker.Item label="Second" value="Second" />
            <Picker.Item label="Third" value="Third" />
            <Picker.Item label="Fourth" value="Fourth" />
          </Picker>
        </View>
      </View>
    </ScrollView>
  );
};

export default Step2Details;