import React from "react";
import { View, Text } from "react-native";
import adminStyles from "../../styles/admin/adminStyles";

export default function VehiclesTenantPage() {
  return (
    <View style={adminStyles.dashboardContainerCentered}>
      <View style={adminStyles.dashboardContentContainer}>
        <Text style={adminStyles.dashboardTitle}>Vehicles Tenant Page</Text>
        <Text style={adminStyles.dashboardContent}>Construction under progress</Text>
      </View>
    </View>
  );
}