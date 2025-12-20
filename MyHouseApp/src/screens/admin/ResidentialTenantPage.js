import React from "react";
import { View, Text } from "react-native";
import adminStyles from "../../styles/admin/adminStyles";

export default function ResidentialTenantPage() {
  return (
    <View style={adminStyles.dashboardContainerCentered}>
      <View style={adminStyles.dashboardContentContainer}>
        <Text style={adminStyles.dashboardTitle}>Residential Tenant Page</Text>
        <Text style={adminStyles.dashboardContent}>Construction under progress</Text>
      </View>
    </View>
  );
}