import { StyleSheet } from "react-native";

const propertyListStyles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center'
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 4,
    padding: 8,
    fontSize: 15,
    backgroundColor: '#fff'
  },
  searchButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 10
  },
  searchButtonText: {
    color: 'white',
    fontSize: 15
  },
  list: {
    flex: 1,
    width: '100%'
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.0,
    elevation: 3
  },
  imagePlaceholder: {
    width: 90,
    height: 120,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderRadius: 6
  },
  imageText: {
    color: '#999',
    fontSize: 11
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-between'
  },
  location: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10
  },
  propertyInfo: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 4
  },
  infoText: {
    fontSize: 15,
    color: '#666',
    marginBottom: 6
  },
  bedroomsText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6
  },
  rentText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd'
  },
  viewMoreButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0
  },
  viewMoreText: {
    color: '#4A90E2',
    fontSize: 15,
    fontWeight: 'bold'
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 15,
    color: '#666',
    marginTop: 15
  },
  noPropertiesText: {
    textAlign: 'center',
    fontSize: 15,
    color: '#666',
    marginTop: 15
  }
});

export default propertyListStyles;