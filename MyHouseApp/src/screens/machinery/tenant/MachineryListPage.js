import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import TenantFilterPanel from "../../../shared/components/TenantFilterPanel";
import { useNavigation } from '@react-navigation/native';
import propertyListStyles from "../../residential/tenant/propertyListStyles";
import machineryListStyles from "./machineryListStyles";
import { getTenantPageStyles } from "../../../styles/tenantPageStyles";
import { getOwnerFormThemeColors } from "../../../styles/ownerFormStyles";
import TenantPageHeader from "../../../shared/components/TenantPageHeader";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { getMachineryProperties } from "./api";
import { useTheme } from "../../../context/ThemeContext";
import { getTimeAgo } from "../../../shared/utils/timeUtils.js";

// Component to display selected filters as horizontal boxes with remove option
const SelectedFilterBox = ({ label, value, onRemove }) => {
  if (!value) return null;
  return (
    <View style={propertyListStyles.selectedFilterBox}>
      <View style={propertyListStyles.selectedFilterContent}>
        <Text style={propertyListStyles.selectedFilterText}>
          {label}: {value}
        </Text>
        <TouchableOpacity onPress={onRemove} style={propertyListStyles.removeFilterButton}>
          <Text style={propertyListStyles.removeFilterText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const RENT_FILTER_OPTIONS = [
  { label: "Any", value: "" },
  { label: "2000-4000", value: "2000-4000" },
  { label: "4000-6000", value: "4000-6000" },
  { label: "6000-8000", value: "6000-8000" },
  { label: "8000-10000", value: "8000-10000" },
  { label: "10000-12000", value: "10000-12000" },
];

const TYPE_FILTER_OPTIONS = [
  { label: "Any", value: "" },
  { label: "Excavator", value: "Excavator" },
  { label: "Crane", value: "Crane" },
  { label: "Bulldozer", value: "Bulldozer" },
  { label: "Loader", value: "Loader" },
];

export default function MachineryListPage() {
  const { dark } = useTheme();
  const themeColors = getOwnerFormThemeColors(dark);
  const tps = getTenantPageStyles(dark);
  const navigation = useNavigation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rentFilter, setRentFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [areaFilterOptions, setAreaFilterOptions] = useState([{ label: "Any", value: "" }]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
  const baseHost = API_BASE_URL.replace(/\/api$/, '');

  // Helper to normalize image URLs
  const normalizeImageUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    if (url.startsWith('http')) return url;
    
    // If it's just a filename, prepend the base upload URL
    // Handle potential non-string values safely
    const filename = String(url).split('/').pop();
    return `${baseHost}/uploads/machinery/${filename}`;
  };

  const collectUniqueAreas = (...sources) => {
    const names = new Set();
    sources.forEach((source) => {
      if (!Array.isArray(source)) return;
      source.forEach((item) => {
        const value = typeof item === 'string' ? item : item?.area;
        if (value != null && String(value).trim()) {
          names.add(String(value).trim());
        }
      });
    });
    return [...names].sort((a, b) => a.localeCompare(b));
  };

  const loadProperties = async (filters = {}) => {
    try {
      setLoading(true);
      const data = await getMachineryProperties(filters);
      console.log('Loaded machinery properties:', data);
      
      // Update area filter options
      const uniqueAreas = collectUniqueAreas(data || []);
      setAreaFilterOptions([
        { label: "Any", value: "" },
        ...uniqueAreas.map((area) => ({ label: area, value: area })),
      ]);
      
      setProperties(data || []);
    } catch (error) {
      Alert.alert("Error", "Failed to load machinery properties. Please try again.");
      console.error("Error loading machinery:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
    const unsubscribe = navigation.addListener('focus', () => loadProperties());
    return unsubscribe;
  }, [navigation]);

  // Apply filters when any filter changes
  useEffect(() => {
    const filters = {};
    if (rentFilter) filters.rent = rentFilter;
    if (typeFilter) filters.type = typeFilter;
    if (areaFilter) filters.area = areaFilter;

    loadProperties(filters);
  }, [rentFilter, typeFilter, areaFilter]);

  const getRentLabel = (value) => {
    switch (value) {
      case '2000-4000': return '₹2000-4000';
      case '4000-6000': return '₹4000-6000';
      case '6000-8000': return '₹6000-8000';
      case '8000-10000': return '₹8000-10000';
      case '10000-12000': return '₹10000-12000';
      default: return '';
    }
  };

  const handleViewDetails = (machineryId) => {
    navigation.navigate('MachineryDetailsPage', { machineryId });
  };

  const renderProperty = ({ item }) => {
    const firstImage = (item.images && item.images.length > 0) 
      ? normalizeImageUrl(item.images[0]) 
      : 'https://coresg-normal.trae.ai/api/ide/v1/text-to-image?prompt=construction%20machinery%20rental%20property%20listing%20placeholder%20image&image_size=square';
    const { colors } = tps;
    const machineryType = item.machinery_type || item.type || "Machinery";
    const machineryModel = item.machinery_model || item.model || "N/A";
    const displayCharge = item.charge_per_day || item.rentPerDay || item.dailyRate || "N/A";

    return (
      <View style={tps.card}>
        <Image
          source={{ uri: firstImage }}
          style={propertyListStyles.imagePlaceholder}
          resizeMode="cover"
        />

        <View style={propertyListStyles.detailsContainer}>
          <Text style={[propertyListStyles.location, { color: colors.text }]}>{item.area || "Unknown Area"}</Text>

          <View style={tps.propertyInfo}>
            <Text style={[propertyListStyles.bedroomsText, { color: colors.text }]}>{machineryType}</Text>
            <Text style={[propertyListStyles.rentText, { color: '#27ae60', borderTopColor: colors.border }]}>
              ₹{displayCharge}/day
            </Text>
          </View>

          <View style={{ flexDirection: 'column' }}>
            <Text style={{ marginLeft: 12, marginBottom: 6, color: colors.subText, fontSize: 12, fontWeight: '500' }}>
              Model: {machineryModel} • Posted {getTimeAgo(item.createdAt)}
            </Text>
            <TouchableOpacity onPress={() => handleViewDetails(item.id)}>
              <Text style={[propertyListStyles.viewMoreText, { color: colors.primary }]}>View More</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const listHeader = () => (
    <View style={propertyListStyles.content}>
      <View style={propertyListStyles.titleRow}>
        <Text style={tps.pageTitle}>Listings</Text>
        <TouchableOpacity style={tps.filterBtn} onPress={() => setIsFilterVisible(!isFilterVisible)}>
          <Text style={tps.filterBtnText}>
            {isFilterVisible ? "Hide Filter" : "Filter"} {isFilterVisible ? "▲" : "▼"}
          </Text>
        </TouchableOpacity>
      </View>
      
      {isFilterVisible && (
        <TenantFilterPanel
          colors={themeColors}
          sections={[
            { key: "rent", label: "Rent", options: RENT_FILTER_OPTIONS, value: rentFilter, onSelect: setRentFilter },
            { key: "type", label: "Type", options: TYPE_FILTER_OPTIONS, value: typeFilter, onSelect: setTypeFilter },
            { key: "area", type: "searchable", label: "Area", options: areaFilterOptions, value: areaFilter, onSelect: setAreaFilter, placeholder: "Search area..." },
          ]}
        />
      )}

      {/* Display selected filters horizontally with remove option */}
      <View style={propertyListStyles.selectedFiltersContainer}>
        <SelectedFilterBox 
          label="Rent" 
          value={getRentLabel(rentFilter)} 
          onRemove={() => setRentFilter('')} 
        />
        <SelectedFilterBox 
          label="Type" 
          value={typeFilter} 
          onRemove={() => setTypeFilter('')} 
        />
        <SelectedFilterBox 
          label="Area" 
          value={areaFilter} 
          onRemove={() => setAreaFilter('')} 
        />
      </View>
      {loading && (
        <Text style={machineryListStyles.loadingText}>Loading machinery...</Text>
      )}
      {!loading && properties.length === 0 && (
        <Text style={machineryListStyles.noPropertiesText}>No machinery found</Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={tps.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <Header />
      <TenantPageHeader
        title="Available Machinery"
        subtitle="Find equipment for rent in your area"
      />
      <FlatList
        data={properties}
        renderItem={renderProperty}
        keyExtractor={(item) => (item?.id || Math.random()).toString()}
        style={machineryListStyles.list}
        ListHeaderComponent={listHeader}
        showsVerticalScrollIndicator={false}
      />

      <Footer />
    </KeyboardAvoidingView>
  );
}
