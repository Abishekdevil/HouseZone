import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import categoryContentStyles from '../styles/categoryContentStyles';
import { getTenantPageStyles } from '../styles/tenantPageStyles';
import propertyListStyles from './residential/tenant/propertyListStyles';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getAllJobSeekerProfiles } from './jobSeeker/logic/api';

const capitalize = (str) => {
  if (!str) return "";
  return String(str).charAt(0).toUpperCase() + String(str).slice(1);
};

const ProfileCard = ({ profile, onViewDetails, dark = false, tps }) => {
  if (!profile) return null;
  const isExperienced = profile.experienceStatus === 'experienced';
  const expBadgeBg = isExperienced ? '#fef3c7' : '#dcfce7';
  const expBadgeText = isExperienced ? '#92400e' : '#166534';
  const cardBg = dark ? '#1f2937' : '#ffffff';
  const borderColor = dark ? '#374151' : '#e5e7eb';

  return (
    <View style={[propertyListStyles.card, { backgroundColor: cardBg, borderColor: borderColor, borderWidth: 1 }]}>
      <View style={[propertyListStyles.imagePlaceholder, { backgroundColor: dark ? '#374151' : '#eff6ff', marginRight: 12 }]}>
        <Text style={{ fontSize: 40 }}>👤</Text>
      </View>
      <View style={propertyListStyles.detailsContainer}>
        <Text style={{ fontSize: 17, fontWeight: '700', color: dark ? '#f9fafb' : '#111827', marginBottom: 6 }} numberOfLines={1}>
          {profile.name}
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 }}>
          <View style={[styles.chip, { backgroundColor: dark ? '#4b5563' : '#f3f4f6' }]}>
            <Text style={[styles.chipText, { color: dark ? '#d1d5db' : '#374151' }]}>{profile.age} yrs</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: dark ? '#4b5563' : '#f3f4f6' }]}>
            <Text style={[styles.chipText, { color: dark ? '#d1d5db' : '#374151' }]}>{capitalize(profile.gender)}</Text>
          </View>
        </View>

        <View style={{ marginBottom: 6 }}>
          <Text style={{ fontSize: 13, color: dark ? '#9ca3af' : '#6b7280', fontWeight: '500' }}>{capitalize(profile.education)}</Text>
        </View>

        <View style={{ backgroundColor: expBadgeBg, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, marginBottom: 6 }}>
          <Text style={{ color: expBadgeText, fontSize: 12, fontWeight: '700' }}>
            {isExperienced ? 'Experienced' : 'Fresher'}
          </Text>
        </View>

        <TouchableOpacity onPress={() => onViewDetails(profile)} style={{ alignSelf: 'flex-end', marginTop: 2 }}>
          <Text style={{ color: '#2563eb', fontSize: 14, fontWeight: '700' }}>
            View Details →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function JobGiver() {
  const navigation = useNavigation();
  const { dark } = { dark: false };
  const tps = getTenantPageStyles(dark);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const data = await getAllJobSeekerProfiles();
      if (Array.isArray(data)) {
        setProfiles(data);
      } else {
        setProfiles([]);
      }
    } catch (error) {
      console.error("Error fetching job seeker profiles:", error);
      Alert.alert("Error", "Failed to load job seeker profiles.");
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProfiles();
    }, [])
  );

  const handleViewDetails = (profile) => {
    navigation.navigate('JobSeekerProfileDetails', { profileId: profile.id });
  };

  return (
    <View style={categoryContentStyles.container}>
      <Header />
      <View style={[categoryContentStyles.content, { flex: 1, justifyContent: 'flex-start', paddingBottom: 0, flexDirection: 'column' }]}>
        <View style={{ alignItems: 'center', width: '100%', marginBottom: 18 }}>
          <Text style={categoryContentStyles.pageTitle}>Job Givers</Text>
          <Text style={categoryContentStyles.pageText}>
            Post jobs for your local shop and find workers nearby.
          </Text>
        </View>

        {/* Top section: Available Profiles List */}
        <View style={{ flex: 1, width: '100%' }}>
          <View style={{ paddingHorizontal: 16, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>
              Available Profiles
            </Text>
            <Text style={{ fontSize: 13, color: '#6b7280' }}>
              {loading ? '...' : `${profiles.length} found`}
            </Text>
          </View>

          {loading ? (
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={{ marginTop: 12, color: '#6b7280', fontSize: 14 }}>Loading profiles...</Text>
            </View>
          ) : profiles.length === 0 ? (
            <View style={{ paddingVertical: 40, alignItems: 'center', paddingHorizontal: 20 }}>
              <Text style={propertyListStyles.noPropertiesText}>No job seeker profiles yet</Text>
              <Text style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', marginTop: 8 }}>
                Profiles will appear here once job seekers save their "Add My Profile" form.
              </Text>
            </View>
          ) : (
            <FlatList
              data={profiles}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <ProfileCard profile={item} onViewDetails={handleViewDetails} dark={dark} tps={tps} />
              )}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {/* Bottom section: Two action buttons */}
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
            <Text style={categoryContentStyles.buttonText}>View All Employers</Text>
          </TouchableOpacity>
        </View>
      </View>
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
