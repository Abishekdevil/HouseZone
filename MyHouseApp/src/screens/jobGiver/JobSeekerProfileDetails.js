import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getTenantPageStyles } from '../../styles/tenantPageStyles';
import TenantPageHeader from '../../shared/components/TenantPageHeader';
import { getJobSeekerProfileById } from '../jobSeeker/logic/api';

const capitalize = (str) => {
  if (!str) return "";
  const s = String(str);
  if (s.toLowerCase() === "ug" || s.toLowerCase() === "pg") return s.toUpperCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const formatExperienceYears = (val) => {
  if (!val) return "";
  const map = {
    "1year": "1 Year",
    "2years": "2 Years",
    "3years": "3 Years",
    "4plus": "4+ Years"
  };
  return map[String(val).toLowerCase()] || val;
};

export default function JobSeekerProfileDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const tps = getTenantPageStyles(false);
  const { profileId } = route.params || {};
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId) {
        Alert.alert("Error", "Profile ID not provided");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await getJobSeekerProfileById(profileId);
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile details:", error);
        Alert.alert("Error", "Failed to load profile details");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [profileId]);

  const renderField = (label, value) => (
    <View style={{ marginBottom: 14, paddingBottom: 14, borderBottomColor: '#f0f0f0', borderBottomWidth: 1 }}>
      <Text style={{ color: '#666', fontSize: 13, marginBottom: 4 }}>{label}</Text>
      <Text style={{ color: '#111', fontSize: 16, fontWeight: '600' }}>{value || "-"}</Text>
    </View>
  );

  const handleComeToInterview = () => {
    const name = profile?.name || "The candidate";
    Alert.alert(
      "Interview Confirmed",
      `${name} has been marked to come for an interview. You can contact them on ${profile?.phoneNumber || 'their number'} to schedule.`,
      [{ text: "OK" }]
    );
  };

  if (loading) {
    return (
      <View style={tps.screen}>
        <Header />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={{ marginTop: 12, color: '#555' }}>Loading profile...</Text>
        </View>
        <Footer />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={tps.screen}>
        <Header />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, color: '#555', marginBottom: 20, textAlign: 'center' }}>Profile not found</Text>
          <TouchableOpacity
            style={{ backgroundColor: '#2563eb', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Go Back</Text>
          </TouchableOpacity>
        </View>
        <Footer />
      </View>
    );
  }

  return (
    <View style={tps.screen}>
      <Header />
      <TenantPageHeader
        title="Job Seeker Profile"
        subtitle="Detailed profile information"
      />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
          <View style={{ backgroundColor: '#eff6ff', width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 30 }}>👤</Text>
          </View>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#111', textAlign: 'center', marginBottom: 4 }}>
            {profile.name}
          </Text>
          <Text style={{ fontSize: 14, color: '#2563eb', fontWeight: '600', textAlign: 'center', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {profile.experienceStatus === 'experienced' ? 'Experienced' : 'Fresher'}
          </Text>

          <Text style={{ fontSize: 11, fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 8, marginBottom: 14 }}>
            Personal Details
          </Text>
          {renderField("Age", profile.age ? `${profile.age} years` : "")}
          {renderField("Gender", capitalize(profile.gender))}
          {renderField("Area", profile.area)}
          {renderField("City/Town", profile.city)}
          {renderField("Aadhar Number", profile.aadhar)}
          {renderField("Phone Number", profile.phoneNumber)}

          <Text style={{ fontSize: 11, fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 8, marginBottom: 14 }}>
            Educational Qualification
          </Text>
          {renderField("Education Qualification", capitalize(profile.education))}
          {profile.experienceStatus === 'experienced' && (
            <>
              {renderField("Experience Status", "Experienced")}
              {renderField("Experience Years", formatExperienceYears(profile.experienceYears))}
              {renderField("Experience Field", profile.experienceField)}
            </>
          )}
          {profile.experienceStatus !== 'experienced' && renderField("Experience Status", "Fresher")}
          {renderField("Can Join Immediately", profile.canJoinImmediately ? capitalize(profile.canJoinImmediately) : "")}

          {renderField("Created On", profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "")}
        </View>

        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              marginRight: 8,
              paddingVertical: 14,
              borderRadius: 10,
              alignItems: 'center',
              backgroundColor: '#ffffff',
              borderWidth: 1.5,
              borderColor: '#2563eb',
            }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: '#2563eb', fontWeight: '700', fontSize: 16 }}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              marginLeft: 8,
              paddingVertical: 14,
              borderRadius: 10,
              alignItems: 'center',
              backgroundColor: '#16a34a',
            }}
            onPress={handleComeToInterview}
          >
            <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 16 }}>Come to Interview</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
}
