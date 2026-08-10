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
import { getOwnerFormThemeColors } from '../../styles/ownerFormStyles';
import TenantFilterPanel from '../../shared/components/TenantFilterPanel';

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

const getStatusColor = (status) => {
  if (status === 'accepted') return '#27ae60';
  if (status === 'declined') return '#e74c3c';
  return '#f39c12';
};

const ProfileCard = ({ profile, onViewDetails, tps, dark }) => {
  if (!profile) return null;
  const { colors } = tps;
  const isExperienced = String(profile.experience || '').toLowerCase() === 'experienced';
  const experienceLabel = isExperienced ? 'Experienced' : 'Fresher';
  const experienceColor = isExperienced ? '#92400e' : '#166534';
  const statusColor = profile.status ? getStatusColor(profile.status) : null;

  return (
    <View style={tps.card}>
      <View style={{ flexDirection: 'column', alignItems: 'center', width: 120, minWidth: 120 }}>
        <View
          style={[propertyListStyles.imagePlaceholder, { justifyContent: 'center', alignItems: 'center', backgroundColor: dark ? '#374151' : '#eff6ff', marginRight: 0 }]}
        >
          <Text style={{ fontSize: 40 }}>👤</Text>
        </View>
        <Text style={{ marginTop: 8, fontSize: 10, fontWeight: '500', color: colors.subText, textAlign: 'center' }}>
          {profile.age} yrs • {capitalize(profile.gender)}
        </Text>
      </View>

      <View style={propertyListStyles.detailsContainer}>
        <Text style={[propertyListStyles.location, { color: colors.text }]}>
          {profile.fullName || profile.name}
        </Text>

        <View style={tps.propertyInfo}>
          <Text style={[propertyListStyles.bedroomsText, { color: colors.text }]}>
            {capitalize(profile.education)}
          </Text>
          <Text style={[propertyListStyles.rentText, { color: experienceColor, borderTopColor: colors.border }]}>
            {experienceLabel}
          </Text>
        </View>

        {profile.status && (
          <View style={{ marginTop: 6 }}>
            <Text style={{
              fontSize: 11,
              fontWeight: '600',
              color: statusColor,
              textTransform: 'capitalize'
            }}>
              Status: {profile.status}
            </Text>
          </View>
        )}

        <View style={{ alignItems: 'flex-end', marginTop: 4 }}>
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
  const themeColors = getOwnerFormThemeColors(dark);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobGiverId, setJobGiverId] = useState(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [ageFilter, setAgeFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [educationFilter, setEducationFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [filteredApplicants, setFilteredApplicants] = useState([]);

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

  useEffect(() => {
    let result = [...applicants];
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
      result = result.filter(p => String(p.experience || '').toLowerCase() === String(experienceFilter).toLowerCase());
    }
    setFilteredApplicants(result);
  }, [applicants, ageFilter, genderFilter, educationFilter, experienceFilter]);

  const handleViewDetails = (profile) => {
    navigation.navigate('JobGiverJobSeekerDetails', { jobSeekerId: profile.id });
  };

  const clearAllFilters = () => {
    setAgeFilter('');
    setGenderFilter('');
    setEducationFilter('');
    setExperienceFilter('');
  };

  const hasAnyFilter = ageFilter || genderFilter || educationFilter || experienceFilter;

  const listHeader = () => (
    <View style={propertyListStyles.content}>
      <View style={propertyListStyles.titleRow}>
        <Text style={tps.pageTitle}>Applicants to Your Company</Text>
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

      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 13, color: '#6b7280' }}>
          {loading ? 'Loading...' : `${filteredApplicants.length} found`}
        </Text>
      </View>

      {isFilterVisible && (
        <View style={{ marginBottom: 10 }}>
          <TenantFilterPanel
            colors={themeColors}
            sections={[
              { key: "age", label: "Age", options: AGE_FILTER_OPTIONS, value: ageFilter, onSelect: setAgeFilter },
              { key: "gender", label: "Gender", options: GENDER_FILTER_OPTIONS, value: genderFilter, onSelect: setGenderFilter },
              { key: "education", label: "Education", options: EDUCATION_FILTER_OPTIONS, value: educationFilter, onSelect: setEducationFilter },
              { key: "experience", label: "Experience", options: EXPERIENCE_FILTER_OPTIONS, value: experienceFilter, onSelect: setExperienceFilter },
            ]}
          />
        </View>
      )}

      {hasAnyFilter && (
        <View style={propertyListStyles.selectedFiltersContainer}>
          <SelectedFilterBox label="Age" value={getAgeLabel(ageFilter)} onRemove={() => setAgeFilter("")} dark={dark} />
          <SelectedFilterBox label="Gender" value={getGenderLabel(genderFilter)} onRemove={() => setGenderFilter("")} dark={dark} />
          <SelectedFilterBox label="Education" value={getEducationLabel(educationFilter)} onRemove={() => setEducationFilter("")} dark={dark} />
          <SelectedFilterBox label="Experience" value={getExperienceLabel(experienceFilter)} onRemove={() => setExperienceFilter("")} dark={dark} />
        </View>
      )}

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
      ) : filteredApplicants.length === 0 ? (
        <View style={{ paddingVertical: 40, alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={propertyListStyles.noPropertiesText}>No applicants yet</Text>
          <Text style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', marginTop: 8 }}>
            {hasAnyFilter
              ? 'No applicants match your filters. Try adjusting your filter criteria.'
              : 'When job seekers apply to your company jobs, their applications will appear here.'}
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
        data={filteredApplicants}
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
