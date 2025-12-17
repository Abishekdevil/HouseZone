import { StyleSheet } from "react-native";

const categoryContentStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  pageText: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 15,
  },
  roleInfo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A90E2",
    marginBottom: 20,
  },
  input: {
    height: 45,
    borderColor: '#4A90E2',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 12,
    marginBottom: 12,
    width: '100%',
    fontSize: 15,
    backgroundColor: '#fff',
    color: '#000',
  },
  inputContainer: {
    marginBottom: 15,
    width: '100%',
  },
  pickerContainer: {
    height: 45,
    borderColor: '#4A90E2',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    width: '100%',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  picker: {
    height: 65,
    width: '100%',
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
    alignSelf: 'flex-start',
    color: '#000',
  },
  value: {
    fontSize: 15,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    width: '100%',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 5,
    minWidth: 90,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#4A90E2',
  },
  secondaryButton: {
    backgroundColor: '#FF6B6B', // Changed from grey to red/pink color
  },
  cancelButton: {
    backgroundColor: '#FF6B6B', // Added specific cancel button style
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  progressContainer: {
    padding: 8,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  formContainer: {
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderRadius: 8,
    padding: 15,
    width: '100%',
    marginBottom: 15,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#4A90E2',
  },
});

export default categoryContentStyles;