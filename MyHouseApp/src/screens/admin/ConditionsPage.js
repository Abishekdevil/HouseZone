import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import categoryContentStyles from "../../styles/categoryContentStyles";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function ConditionsPage() {
  const navigation = useNavigation();
  const [conditions, setConditions] = useState({
    condition1: false,
    condition2: false,
    condition3: false,
    condition4: false,
    condition5: false,
    condition6: false,
  });

  const predefinedConditions = [
    'No structural changes without owner’s permission.',
    'Water and electricity bills must be paid by the tenant.',
    'Advance/deposit amount is non-refundable.',
    'No damage to property, repair costs will be deducted from the deposit.',
    'Pets are not allowed on the premises.',
    'Only Vegetarian.'
  ];

  const handleConditionToggle = (field) => {
    setConditions(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleUpdateConditions = () => {
    // Validate that at least one condition is selected
    const selectedConditions = Object.values(conditions).filter(value => value === true);
    
    if (selectedConditions.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one condition');
      return;
    }

    // Show success message
    Alert.alert(
      'Success',
      'Conditions updated successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to the previous page
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={categoryContentStyles.container}>
      <Header />
      
      <View style={categoryContentStyles.content}>
        <Text style={categoryContentStyles.pageTitle}>Conditions</Text>
        <Text style={categoryContentStyles.pageText}>Please select the applicable conditions for the property</Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Condition 1 */}
          <View style={categoryContentStyles.formGroup}>
            <TouchableOpacity style={categoryContentStyles.checkboxContainer} onPress={() => handleConditionToggle('condition1')}>
              <View style={[categoryContentStyles.customCheckbox, conditions.condition1 && categoryContentStyles.checkboxChecked]}>
                {conditions.condition1 && <Text style={categoryContentStyles.checkboxCheckmark}>✓</Text>}
              </View>
              <Text style={categoryContentStyles.label}>{predefinedConditions[0]}</Text>
            </TouchableOpacity>
          </View>
          
          {/* Condition 2 */}
          <View style={categoryContentStyles.formGroup}>
            <TouchableOpacity style={categoryContentStyles.checkboxContainer} onPress={() => handleConditionToggle('condition2')}>
              <View style={[categoryContentStyles.customCheckbox, conditions.condition2 && categoryContentStyles.checkboxChecked]}>
                {conditions.condition2 && <Text style={categoryContentStyles.checkboxCheckmark}>✓</Text>}
              </View>
              <Text style={categoryContentStyles.label}>{predefinedConditions[1]}</Text>
            </TouchableOpacity>
          </View>
          
          {/* Condition 3 */}
          <View style={categoryContentStyles.formGroup}>
            <TouchableOpacity style={categoryContentStyles.checkboxContainer} onPress={() => handleConditionToggle('condition3')}>
              <View style={[categoryContentStyles.customCheckbox, conditions.condition3 && categoryContentStyles.checkboxChecked]}>
                {conditions.condition3 && <Text style={categoryContentStyles.checkboxCheckmark}>✓</Text>}
              </View>
              <Text style={categoryContentStyles.label}>{predefinedConditions[2]}</Text>
            </TouchableOpacity>
          </View>
          
          {/* Condition 4 */}
          <View style={categoryContentStyles.formGroup}>
            <TouchableOpacity style={categoryContentStyles.checkboxContainer} onPress={() => handleConditionToggle('condition4')}>
              <View style={[categoryContentStyles.customCheckbox, conditions.condition4 && categoryContentStyles.checkboxChecked]}>
                {conditions.condition4 && <Text style={categoryContentStyles.checkboxCheckmark}>✓</Text>}
              </View>
              <Text style={categoryContentStyles.label}>{predefinedConditions[3]}</Text>
            </TouchableOpacity>
          </View>
          
          {/* Condition 5 */}
          <View style={categoryContentStyles.formGroup}>
            <TouchableOpacity style={categoryContentStyles.checkboxContainer} onPress={() => handleConditionToggle('condition5')}>
              <View style={[categoryContentStyles.customCheckbox, conditions.condition5 && categoryContentStyles.checkboxChecked]}>
                {conditions.condition5 && <Text style={categoryContentStyles.checkboxCheckmark}>✓</Text>}
              </View>
              <Text style={categoryContentStyles.label}>{predefinedConditions[4]}</Text>
            </TouchableOpacity>
          </View>
          
          {/* Condition 6 */}
          <View style={categoryContentStyles.formGroup}>
            <TouchableOpacity style={categoryContentStyles.checkboxContainer} onPress={() => handleConditionToggle('condition6')}>
              <View style={[categoryContentStyles.customCheckbox, conditions.condition6 && categoryContentStyles.checkboxChecked]}>
                {conditions.condition6 && <Text style={categoryContentStyles.checkboxCheckmark}>✓</Text>}
              </View>
              <Text style={categoryContentStyles.label}>{predefinedConditions[5]}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={categoryContentStyles.buttonRow}>
            <TouchableOpacity
              style={[categoryContentStyles.button, categoryContentStyles.cancelButton]}
              onPress={handleGoBack}
            >
              <Text style={categoryContentStyles.buttonText}>Back</Text>
            </TouchableOpacity>
            
            <View style={{ flex: 1 }} />
            
            <TouchableOpacity
              style={[categoryContentStyles.button, categoryContentStyles.primaryButton]}
              onPress={handleUpdateConditions}
            >
              <Text style={categoryContentStyles.buttonText}>Update</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      
      <Footer />
    </View>
  );
}