import { StyleSheet } from "react-native";

const propertyListStyles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center'
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 4,
    padding: 6,
    fontSize: 13,
    backgroundColor: '#fff'
  },
  searchButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 6
  },
  searchButtonText: {
    color: 'white',
    fontSize: 13
  },
  list: {
    flex: 1,
    width: '100%'
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.08,
    shadowRadius: 1.5,
    elevation: 2
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderRadius: 5
  },
  imageText: {
    color: '#999',
    fontSize: 9
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-between'
  },
  location: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8
  },
  propertyInfo: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 3
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5
  },
  bedroomsText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5
  },
  rentText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
    marginTop: 4,
    paddingTop: 5,
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
    fontSize: 13,
    fontWeight: 'bold'
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#666',
    marginTop: 12
  },
  noPropertiesText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#666',
    marginTop: 12
  }
});

export default propertyListStyles;