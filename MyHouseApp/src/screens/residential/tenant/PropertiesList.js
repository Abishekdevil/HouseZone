import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import categoryContentStyles from '../../../styles/categoryContentStyles';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { getAllProperties, searchProperties } from './api';
import propertyListStyles from './propertyListStyles';

const PropertyCard = ({ property, onViewDetails }) => {
  return (
    <View style={propertyListStyles.card}>
      {/* Left side - Placeholder for image */}
      <View style={propertyListStyles.imagePlaceholder}>
        <Text style={propertyListStyles.imageText}>Property Image</Text>
      </View>
      
      {/* Right side - Property details */}
      <View style={propertyListStyles.detailsContainer}>
        <Text style={propertyListStyles.location}>{property.area}</Text>
        <View style={propertyListStyles.propertyInfo}>
          <Text style={propertyListStyles.bedroomsText}>{property.bedrooms ? `${property.bedrooms} BHK` : 'N/A'}</Text>
          <Text style={propertyListStyles.rentText}>₹{property.rent || 'N/A'}/month</Text>
        </View>
        <Text style={propertyListStyles.viewMoreText} onPress={() => onViewDetails(property.id)}>View More</Text>
      </View>
    </View>
  );
};

export default function PropertiesList() {
  const navigation = useNavigation();
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await getAllProperties();
      setProperties(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load properties. Please try again.');
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadProperties();
      return;
    }
    
    try {
      setLoading(true);
      const data = await searchProperties(searchTerm);
      setProperties(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to search properties. Please try again.');
      console.error('Error searching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (propertyId) => {
    navigation.navigate('PropertyDetails', { propertyId });
  };

  const renderProperty = ({ item }) => (
    <PropertyCard property={item} onViewDetails={handleViewDetails} />
  );

  return (
    <View style={categoryContentStyles.container}>
      <Header />
      
      {/* Content */}
      <View style={categoryContentStyles.content}>
        <Text style={categoryContentStyles.pageTitle}>Available Properties</Text>
        
        {/* Search Bar */}
        <View style={propertyListStyles.searchContainer}>
          <TextInput
            style={propertyListStyles.searchInput}
            placeholder="Search by owner name, area, or city..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <TouchableOpacity 
            style={propertyListStyles.searchButton}
            onPress={handleSearch}
          >
            <Text style={propertyListStyles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
        
        {/* Properties List */}
        {loading ? (
          <Text style={propertyListStyles.loadingText}>Loading properties...</Text>
        ) : properties.length === 0 ? (
          <Text style={propertyListStyles.noPropertiesText}>No properties found</Text>
        ) : (
          <FlatList
            data={properties}
            renderItem={renderProperty}
            keyExtractor={(item) => item.id.toString()}
            style={propertyListStyles.list}
          />
        )}
      </View>
      
      <Footer />
    </View>
  );
}
