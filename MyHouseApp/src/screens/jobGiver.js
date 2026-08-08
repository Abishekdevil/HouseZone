import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import categoryContentStyles from '../styles/categoryContentStyles';
import { getTenantPageStyles } from '../styles/tenantPageStyles';
import propertyListStyles from './residential/tenant/propertyListStyles';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getJobSeekers } from './jobGiver/logic/api';
import TenantPageHeader from '../shared/components/TenantPageHeader';
import { useTheme } from '../context/ThemeContext';

const capitalize = (str) => {
  if (!str) return "";
  return String(str).charAt(0).toUpperCase() + String(str).slice(1);
};

const getStatusColor = (status) => {
  if (status === 'accepted') return '#27ae60';
  if (status === 'declined') return '#e74c3c';
  return '#f39c12';
};

const ApplicationCard = ({ jobSeeker, onViewDetails, tps, dark }) => {
  if (!jobSeeker) return null;
  const { colors } = tps;
  const statusColor = getStatusColor(jobSeeker.status);

  return (
    <View style={tps.card}>
      <View
        style={[propertyListStyles.imagePlaceholder, { justifyContent: 'center', alignItems: 'center', backgroundColor: dark ? '#374151' : '#eff6ff' }]}
      >
        <Text style={{ fontSize: 40 }}>👤</Text>
      </View>

      <View style={propertyListStyles.detailsContainer}>
        <Text style={[propertyListStyles.location, { color: colors.text }]}>
          {jobSeeker.fullName}
        </Text>

        <View style={tps.propertyInfo}>
          <Text style={[propertyListStyles.bedroomsText, { color: colors.text }]}>
            {jobSeeker.education} • {jobSeeker.experience}
          </Text>
          <Text style={[propertyListStyles.rentText, { color: statusColor, borderTopColor: colors.border }]}>
            {capitalize(jobSeeker.status || 'pending')}
          </Text>
        </View>

        <View style={{ flexDirection: 'column' }}>
          {jobSeeker.shopName ? (
            <Text style={{ marginLeft: 12, marginBottom: 6, color: colors.subText, fontSize: 12, fontWeight: '500' }}>
              Applied to: {jobSeeker.shopName} • Age {jobSeeker.age} • {capitalize(jobSeeker.gender)}
            </Text>
          ) : (
            <Text style={{ marginLeft: 12, marginBottom: 6, color: colors.subText, fontSize: 12, fontWeight: '500' }}>
              Age {jobSeeker.age} • {capitalize(jobSeeker.gender)}
            </Text>
          )}
          <TouchableOpacity onPress={() => onViewDetails(jobSeeker)}>
            <Text style={[propertyListStyles.viewMoreText, { color: colors.primary }]}>View More</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function JobGiver() {
  const navigation = useNavigation();
  const { dark } = useTheme();
  const tps = getTenantPageStyles(dark);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await getJobSeekers();
      if (Array.isArray(data)) {
        setApplications(data);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error("Error fetching job seeker applications:", error);
      Alert.alert("Error", "Failed to load applications.");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchApplications();
    }, [])
  );

  const handleViewDetails = (jobSeeker) => {
    navigation.navigate('JobGiverJobSeekerDetails', { jobSeekerId: jobSeeker.id });
  };

  const listHeader = () => (
    <View style={propertyListStyles.content}>
      <View style={propertyListStyles.titleRow}>
        <Text style={tps.pageTitle}>Applications Received</Text>
      </View>

      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 13, color: '#6b7280' }}>
          {loading ? 'Loading...' : `${applications.length} application${applications.length === 1 ? '' : 's'} found`}
        </Text>
      </View>

      {loading ? (
        <View style={{ paddingVertical: 40, alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={{ marginTop: 12, color: '#6b7280', fontSize: 14 }}>Loading applications...</Text>
        </View>
      ) : applications.length === 0 ? (
        <View style={{ paddingVertical: 40, alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={propertyListStyles.noPropertiesText}>No applications yet</Text>
          <Text style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', marginTop: 8 }}>
            Applications will appear here once job seekers apply to your company postings.
          </Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={categoryContentStyles.container}>
      <Header />
      <TenantPageHeader
        title="Job Givers"
        subtitle="Post jobs for your local shop and find workers nearby."
      />
      <View style={[categoryContentStyles.content, { flex: 1, justifyContent: 'flex-start', paddingBottom: 0, flexDirection: 'column', paddingTop: 0 }]}>

        <View style={{ flex: 1, width: '100%' }}>
          <FlatList
            data={applications}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <ApplicationCard jobSeeker={item} onViewDetails={handleViewDetails} tps={tps} dark={dark} />
            )}
            style={propertyListStyles.list}
            ListHeaderComponent={listHeader}
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View style={[categoryContentStyles.buttonRow, { marginBottom: 24, marginTop: 8, width: '100%' }]}>
          <TouchableOpacity
            style={[categoryContentStyles.button, categoryContentStyles.primaryButton]}
            onPress={() => navigation.navigate("AddJobGiver")}
          >
            <Text style={categoryContentStyles.buttonText}>Register Your Company</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[categoryContentStyles.button, categoryContentStyles.secondaryButton]}
            onPress={() => navigation.navigate("JobGiverJobSeekers")}
          >
            <Text style={categoryContentStyles.buttonText}>View All Employees</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Footer />
    </View>
  );
}
