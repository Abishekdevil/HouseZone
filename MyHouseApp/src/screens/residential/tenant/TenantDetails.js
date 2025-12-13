import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import categoryContentStyles from '../../../styles/categoryContentStyles';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function TenantDetails() {
  const navigation = useNavigation();

  return (
    <View style={categoryContentStyles.container}>
      <Header />
      
      <View style={categoryContentStyles.content}>
        <ScrollView style={{ width: '100%' }}>
          <Text style={categoryContentStyles.pageTitle}>Tenant Details</Text>
          <Text style={categoryContentStyles.pageText}>
            This is the tenant details page. You can add tenant-specific information here.
          </Text>
          

        </ScrollView>
        
        <TouchableOpacity 
          style={[categoryContentStyles.button, categoryContentStyles.primaryButton]} 
          onPress={() => navigation.goBack()}
        >
          <Text style={categoryContentStyles.buttonText}>Back to Property Details</Text>
        </TouchableOpacity>
      </View>
      
      <Footer />
    </View>
  );
}
