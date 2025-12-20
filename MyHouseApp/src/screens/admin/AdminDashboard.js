import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import adminStyles from "../../styles/admin/adminStyles";

export default function AdminDashboard() {
  const navigation = useNavigation();
  
  // Button data with labels and navigation targets
  const buttons = [
    { label: "Signup", target: "SignupPage" },
    { label: "Login", target: "LoginPage" },
    { label: "Residential-Owner", target: "ResidentialOwnerPage" },
    { label: "Residential-Tenant", target: "ResidentialTenantPage" },
    { label: "Business-owner", target: "BusinessOwnerPage" },
    { label: "Business-Tenant", target: "BusinessTenantPage" },
    { label: "Vehicles-Owner", target: "VehiclesOwnerPage" },
    { label: "Vehicles-Tenant", target: "VehiclesTenantPage" },
    { label: "Machinery-Owner", target: "MachineryOwnerPage" },
    { label: "Machinery-Tenant", target: "MachineryTenantPage" },
  ];

  return (
    <ScrollView contentContainerStyle={adminStyles.dashboardContainerCentered}>
      <View style={adminStyles.dashboardContentContainer}>
        <Text style={adminStyles.dashboardTitle}>Admin Dashboard</Text>
        
        {/* Admin Navigation Buttons */}
        <View style={adminStyles.buttonsGrid}>
          {buttons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={adminStyles.dashboardButton}
              onPress={() => navigation.navigate(button.target)}
            >
              <Text style={adminStyles.btnText}>{button.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity
          style={adminStyles.logoutButton}
          onPress={() => navigation.navigate("Dummy")}
        >
          <Text style={adminStyles.btnText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}