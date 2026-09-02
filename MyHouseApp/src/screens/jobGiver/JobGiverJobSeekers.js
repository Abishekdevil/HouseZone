import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getTenantPageStyles } from '../../styles/tenantPageStyles';
import propertyListStyles from '../residential/tenant/propertyListStyles';
import TenantPageHeader from '../../shared/components/TenantPageHeader';
import { useTheme } from '../../context/ThemeContext';
import { getJobSeekers } from './logic/api';
import { getTimeAgo } from '../../shared/utils/timeUtils.js';

const capitalize = (str) => {
  if (!str) return "";
  return String(str).charAt(0).toUpperCase() + String(str).slice(1);
};

const ProfileCard = ({ profile, onViewDetails, tps, dark }) => {
  if (!profile) return null;
  const { colors } = tps;
  const isExperienced = String(profile.experience || profile.experienceStatus || '').toLowerCase() === 'experienced';
  const experienceLabel = isExperienced ? 'Experienced' : 'Fresher';
  const experienceColor = isExperienced ? '#92400e' : '#166534';
  const postedAgoText = getTimeAgo(profile.createdAt || profile.created_at);

  return (
    <View style={tps.card}>
      <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', width: 120, minWidth: 120 }}>
        <View
          style={[propertyListStyles.imagePlaceholder, { justifyContent: 'center', alignItems: 'center', backgroundColor: dark ? '#374151' : '#eff6ff', marginRight: 0 }]}
        >
          <Text style={{ fontSize: 40 }}>👤</Text>
        </View>
        <Text style={{ marginTop: 8, fontSize: 10, fontWeight: '500', color: colors.subText, textAlign: 'center' }}>
          Posted {postedAgoText}
        </Text>
      </View>

      <View style={propertyListStyles.detailsContainer}>
        <Text style={[propertyListStyles.location, { color: colors.text }]}>
          {profile.fullName || profile.name}
        </Text>

        {!!profile.age && (
          <Text style={{ fontSize: 13, color: colors.subText, marginTop: 2, fontWeight: '500' }}>
            {profile.age} yrs
          </Text>
        )}

        <View style={tps.propertyInfo}>
          <Text style={[propertyListStyles.bedroomsText, { color: colors.text }]}>
            {capitalize(profile.education)}
          </Text>
          <Text style={[propertyListStyles.rentText, { color: experienceColor, borderTopColor: colors.border }]}>
            {experienceLabel}
          </Text>
        </View>

        <View style={{ alignItems: 'flex-end', marginTop: 8 }}>
          <TouchableOpacity onPress={() => onViewDetails(profile)}>
            <Text style={[propertyListStyles.viewMoreText, { color: colors.primary, textAlign: 'right' }]}>View Details →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function JobGiverJobSeekers() {
  const navigation = useNavigation();
  const { dark } = useTheme();
  const tps = getTenantPageStyles(dark);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobGiverId, setJobGiverId] = useState(null);

  const fetchApplicants = async (currentJobGiverId) => {
    try {
      setLoading(true);
      const data = await getJobSeekers(currentJobGiverId);
      if (Array.isArray(data)) {
        setApplicants(data);
      } else {
        setApplicants([]);
      }
    } catch (error) {
      console.error("Error fetching job applicants:", error);
      Alert.alert("Error", "Failed to load applicants.");
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const load = async () => {
        let storedId = null;
        try {
          storedId = await AsyncStorage.getItem('jobGiverId');
        } catch (e) {
          console.warn('[JobGiverJobSeekers] Could not read jobGiverId:', e);
        }
        setJobGiverId(storedId);
        if (storedId) {
          await fetchApplicants(storedId);
        } else {
          setLoading(false);
          setApplicants([]);
        }
      };
      load();
    }, [])
  );

  const handleViewDetails = (profile) => {
    navigation.navigate('JobGiverJobSeekerDetails', { jobSeekerId: profile.id });
  };

  const listHeader = () => (
    <View style={propertyListStyles.content}>
      <View style={propertyListStyles.titleRow}>
        <Text style={tps.pageTitle}>Applicants to Your Company</Text>
      </View>

      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 13, color: '#6b7280' }}>
          {loading ? 'Loading...' : `${applicants.length} found`}
        </Text>
      </View>

      {!jobGiverId && !loading ? (
        <View style={{ paddingVertical: 40, alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={propertyListStyles.noPropertiesText}>No Company Registered</Text>
          <Text style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', marginTop: 8 }}>
            Please register your company first using the "Register Your Company" button on the Job Giver page. Once registered, applicants to your jobs will appear here.
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 16,
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: '#2563eb',
              borderRadius: 8,
            }}
            onPress={() => navigation.navigate('AddJobGiver')}
          >
            <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '600' }}>Register Your Company</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <View style={{ paddingVertical: 40, alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={{ marginTop: 12, color: '#6b7280', fontSize: 14 }}>Loading applicants...</Text>
        </View>
      ) : applicants.length === 0 ? (
        <View style={{ paddingVertical: 40, alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={propertyListStyles.noPropertiesText}>No applicants yet</Text>
          <Text style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', marginTop: 8 }}>
            When job seekers apply to your company jobs, their applications will appear here.
          </Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={tps.screen}>
      <Header />
      <TenantPageHeader
        title="Job Applicants"
        subtitle="People who applied to your company jobs"
      />
      <FlatList
        data={applicants}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ProfileCard profile={item} onViewDetails={handleViewDetails} tps={tps} dark={dark} />
        )}
        style={propertyListStyles.list}
        ListHeaderComponent={listHeader}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
