import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import categoryContentStyles from '../styles/categoryContentStyles';
import { getTenantPageStyles } from '../styles/tenantPageStyles';
import propertyListStyles from './residential/tenant/propertyListStyles';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getAllJobSeekerProfiles } from './jobSeeker/logic/api';
import TenantFilterPanel from '../shared/components/TenantFilterPanel';
import { getOwnerFormThemeColors } from '../styles/ownerFormStyles';
import { useTheme } from '../context/ThemeContext';
import TenantPageHeader from '../shared/components/TenantPageHeader';

const capitalize = (str) => {
  if (!str) return "";
  return String(str).charAt(0).toUpperCase() + String(str).slice(1);
};

const AGE_FILTER_OPTIONS = [
  { label: "Any", value: "" },
  { label: "18-30", value: "18-30" },
  { label: "30-50", value: "30-50" },
  { label: "50-60", value: "50-60" },
];

const GENDER_FILTER_OPTIONS = [
  { label: "Any", value: "" },
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const EDUCATION_FILTER_OPTIONS = [
  { label: "Any", value: "" },
  { label: "10th", value: "10th" },
  { label: "12th", value: "12th" },
  { label: "UG", value: "ug" },
  { label: "PG", value: "pg" },
  { label: "Diploma", value: "diploma" },
  { label: "Other", value: "other" },
];

const EXPERIENCE_FILTER_OPTIONS = [
  { label: "Any", value: "" },
  { label: "Fresher", value: "fresher" },
  { label: "Experienced", value: "experienced" },
];

const SelectedFilterBox = ({ label, value, onRemove, dark = false }) => {
  if (!value) return null;
  const tps = getTenantPageStyles(dark);
  const { colors } = tps;
  return (
    <View style={propertyListStyles.selectedFilterBox}>
      <View style={propertyListStyles.selectedFilterContent}>
        <Text style={[propertyListStyles.selectedFilterText, { color: colors.text }]}>
          {label}: {value}
        </Text>
        <TouchableOpacity onPress={onRemove} style={propertyListStyles.removeFilterButton}>
          <Text style={propertyListStyles.removeFilterText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getAgeLabel = (value) => {
  if (!value) return '';
  const found = AGE_FILTER_OPTIONS.find(o => o.value === value);
  return found ? found.label : '';
};

const getGenderLabel = (value) => {
  if (!value) return '';
  const found = GENDER_FILTER_OPTIONS.find(o => o.value === value);
  return found ? found.label : '';
};

const getEducationLabel = (value) => {
  if (!value) return '';
  const found = EDUCATION_FILTER_OPTIONS.find(o => o.value === value);
  return found ? found.label : '';
};

const getExperienceLabel = (value) => {
  if (!value) return '';
  const found = EXPERIENCE_FILTER_OPTIONS.find(o => o.value === value);
  return found ? found.label : '';
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
  const { dark } = useTheme();
  const themeColors = getOwnerFormThemeColors(dark);
  const tps = getTenantPageStyles(dark);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [ageFilter, setAgeFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [educationFilter, setEducationFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState([]);

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

  useEffect(() => {
    let result = [...profiles];
    if (ageFilter) {
      const [minAge, maxAge] = ageFilter.split('-').map(Number);
      result = result.filter(p => {
        const age = Number(p.age);
        return !isNaN(age) && age >= minAge && age <= maxAge;
      });
    }
    if (genderFilter) {
      result = result.filter(p => String(p.gender || '').toLowerCase() === String(genderFilter).toLowerCase());
    }
    if (educationFilter) {
      result = result.filter(p => String(p.education || '').toLowerCase() === String(educationFilter).toLowerCase());
    }
    if (experienceFilter) {
      result = result.filter(p => String(p.experienceStatus || '').toLowerCase() === String(experienceFilter).toLowerCase());
    }
    setFilteredProfiles(result);
  }, [profiles, ageFilter, genderFilter, educationFilter, experienceFilter]);

  const handleViewDetails = (profile) => {
    navigation.navigate('JobSeekerProfileDetails', { profileId: profile.id });
  };

  const clearAllFilters = () => {
    setAgeFilter('');
    setGenderFilter('');
    setEducationFilter('');
    setExperienceFilter('');
  };

  const hasAnyFilter = ageFilter || genderFilter || educationFilter || experienceFilter;

  return (
    <View style={categoryContentStyles.container}>
      <Header />
      <TenantPageHeader
        title="Job Givers"
        subtitle="Post jobs for your local shop and find workers nearby."
      />
      <View style={[categoryContentStyles.content, { flex: 1, justifyContent: 'flex-start', paddingBottom: 0, flexDirection: 'column', paddingTop: 0 }]}>

        {/* Top section: Available Profiles List */}
        <View style={{ flex: 1, width: '100%' }}>
          <View style={{ paddingHorizontal: 16, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>
              Available Profiles
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {hasAnyFilter && (
                <TouchableOpacity onPress={clearAllFilters} style={{ marginRight: 8 }}>
                  <Text style={{ fontSize: 12, color: '#dc2626', fontWeight: '600' }}>Clear All</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={tps.filterBtn}
                onPress={() => setIsFilterVisible(!isFilterVisible)}
              >
                <Text style={tps.filterBtnText}>
                  {isFilterVisible ? "Hide Filter" : "Filter"}{" "}
                  {isFilterVisible ? "▲" : "▼"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
            <Text style={{ fontSize: 13, color: '#6b7280' }}>
              {loading ? 'Loading...' : `${filteredProfiles.length} found`}
            </Text>
          </View>

          {isFilterVisible && (
            <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
              <TenantFilterPanel
                colors={themeColors}
                sections={[
                  {
                    key: "age",
                    label: "Age",
                    options: AGE_FILTER_OPTIONS,
                    value: ageFilter,
                    onSelect: setAgeFilter,
                  },
                  {
                    key: "gender",
                    label: "Gender",
                    options: GENDER_FILTER_OPTIONS,
                    value: genderFilter,
                    onSelect: setGenderFilter,
                  },
                  {
                    key: "education",
                    label: "Education",
                    options: EDUCATION_FILTER_OPTIONS,
                    value: educationFilter,
                    onSelect: setEducationFilter,
                  },
                  {
                    key: "experience",
                    label: "Experience",
                    options: EXPERIENCE_FILTER_OPTIONS,
                    value: experienceFilter,
                    onSelect: setExperienceFilter,
                  },
                ]}
              />
            </View>
          )}

          {hasAnyFilter && (
            <View style={[propertyListStyles.selectedFiltersContainer, { paddingHorizontal: 16, marginBottom: 10 }]}>
              <SelectedFilterBox
                label="Age"
                value={getAgeLabel(ageFilter)}
                onRemove={() => setAgeFilter("")}
                dark={dark}
              />
              <SelectedFilterBox
                label="Gender"
                value={getGenderLabel(genderFilter)}
                onRemove={() => setGenderFilter("")}
                dark={dark}
              />
              <SelectedFilterBox
                label="Education"
                value={getEducationLabel(educationFilter)}
                onRemove={() => setEducationFilter("")}
                dark={dark}
              />
              <SelectedFilterBox
                label="Experience"
                value={getExperienceLabel(experienceFilter)}
                onRemove={() => setExperienceFilter("")}
                dark={dark}
              />
            </View>
          )}

          {loading ? (
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={{ marginTop: 12, color: '#6b7280', fontSize: 14 }}>Loading profiles...</Text>
            </View>
          ) : filteredProfiles.length === 0 ? (
            <View style={{ paddingVertical: 40, alignItems: 'center', paddingHorizontal: 20 }}>
              <Text style={propertyListStyles.noPropertiesText}>No job seeker profiles yet</Text>
              <Text style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', marginTop: 8 }}>
                {hasAnyFilter
                  ? 'No profiles match your filters. Try adjusting your filter criteria.'
                  : 'Profiles will appear here once job seekers save their "Add My Profile" form.'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredProfiles}
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
