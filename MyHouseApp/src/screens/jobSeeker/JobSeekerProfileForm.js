import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getOwnerFormStyles } from "../../styles/ownerFormStyles";
import Footer from "../../components/Footer";
import OwnerFormHeader from "../../shared/components/OwnerFormHeader";
import { useTheme } from "../../context/ThemeContext";
import OwnerFormField from "../../shared/components/OwnerFormField";
import OwnerFormCard from "../../shared/components/OwnerFormCard";
import OptionSelectField from "../../shared/components/OptionSelectField";
import { saveJobSeekerProfile, getJobSeekerProfile } from "./logic/api";

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const educationOptions = [
  { label: "10th", value: "10th" },
  { label: "12th", value: "12th" },
  { label: "UG", value: "ug" },
  { label: "PG", value: "pg" },
  { label: "Diploma", value: "diploma" },
  { label: "Other", value: "other" },
];

const experienceStatusOptions = [
  { label: "Fresher", value: "fresher" },
  { label: "Experienced", value: "experienced" },
];

const experienceYearOptions = [
  { label: "1 Year", value: "1year" },
  { label: "2 Years", value: "2years" },
  { label: "3 Years", value: "3years" },
  { label: "4+ Years", value: "4plus" },
];

const initialProfileData = {
  signupId: null,
  name: "",
  age: "",
  gender: "",
  education: "",
  experienceStatus: "",
  experienceYears: "",
  experienceField: "",
};

const validateForm = (data) => {
  const required = ["name", "age", "gender", "education", "experienceStatus"];
  for (const field of required) {
    if (!String(data[field] || "").trim()) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return false;
    }
  }
  const age = parseInt(data.age, 10);
  if (isNaN(age) || age < 14 || age > 100) {
    Alert.alert("Validation Error", "Please enter a valid age between 14 and 100.");
    return false;
  }
  if (data.experienceStatus === "experienced") {
    if (!String(data.experienceYears || "").trim()) {
      Alert.alert("Validation Error", "Please select experience years.");
      return false;
    }
    if (!String(data.experienceField || "").trim()) {
      Alert.alert("Validation Error", "Please enter your experience field.");
      return false;
    }
  }
  return true;
};

export default function JobSeekerProfileForm() {
  const navigation = useNavigation();
  const { dark, colors } = useTheme();
  const ofs = getOwnerFormStyles(colors, dark);
  const [formData, setFormData] = useState(initialProfileData);
  const [isSaving, setIsSaving] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const loadProfile = async () => {
        try {
          const userDetailsRaw = await AsyncStorage.getItem("userDetails");
          const userDetails = userDetailsRaw ? JSON.parse(userDetailsRaw) : null;
          const signupId = userDetails?.id || userDetails?.signupId;

          let prefilledName = "";

          const query = {};
          if (signupId) query.signupId = signupId;
          try {
            const loaded = await getJobSeekerProfile(query);
            if (loaded && typeof loaded === "object" && loaded.name) {
              prefilledName = loaded.name;
            }
          } catch (_err) {
            // ignore
          }

          if (!prefilledName) {
            const stored = await AsyncStorage.getItem("jobSeekerProfile");
            if (stored) {
              const parsed = JSON.parse(stored);
              if (parsed.name) {
                prefilledName = parsed.name;
              }
            }
          }

          if (!prefilledName && userDetails?.name) {
            prefilledName = userDetails.name;
          }

          setFormData({
            ...initialProfileData,
            name: prefilledName,
            signupId: signupId || null,
          });
        } catch (err) {
          console.error("[JobSeekerProfileForm] Failed to load profile:", err);
        }
      };
      loadProfile();
    }, [])
  );

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!validateForm(formData)) return;
    try {
      setIsSaving(true);

      // First try saving to the backend database
      const submitData = { ...formData };
      if (formData.experienceStatus === "fresher") {
        submitData.experienceYears = "";
        submitData.experienceField = "";
      }

      let saved = false;
      try {
        const response = await saveJobSeekerProfile(submitData);
        if (response?.profileId) {
          await AsyncStorage.setItem("jobSeekerProfileId", String(response.profileId));
          saved = true;
        }
      } catch (saveErr) {
        console.warn("[JobSeekerProfileForm] Backend save failed, using fallback AsyncStorage:", saveErr);
      }

      // Always also save a copy to AsyncStorage as a fallback
      await AsyncStorage.setItem("jobSeekerProfile", JSON.stringify(submitData));

      if (saved) {
        Alert.alert("Success", "Your profile has been saved to the database!", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert(
          "Saved Locally",
          "Profile was saved on your device. Backend save failed — please check your server connection.",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error) {
      console.error("[JobSeekerProfileForm] Save error:", error);
      Alert.alert("Error", "Failed to save your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={ofs.screen}
      keyboardVerticalOffset={0}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0f213d" />

      <OwnerFormHeader title="Add My Profile" step={1} maxSteps={1} dark={dark} />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={ofs.scrollContent}
      >
        <View style={ofs.formCenterWrap}>
          <OwnerFormCard
            title="My Profile"
            subtitle="Fill in your details"
            colors={ofs.themeColors}
            dark={dark}
          >
            <OwnerFormField
              label="Name *"
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
              colors={ofs.themeColors}
              dark={dark}
            />
            <OwnerFormField
              label="Age *"
              value={formData.age}
              onChangeText={(value) => handleInputChange("age", value.replace(/\D/g, ""))}
              keyboardType="numeric"
              colors={ofs.themeColors}
              dark={dark}
            />
            <OptionSelectField
              label="Gender *"
              options={genderOptions}
              selectedValue={formData.gender || ""}
              onSelect={(value) => handleInputChange("gender", value)}
              colors={ofs.themeColors}
              dark={dark}
              collapsible
            />
            <OptionSelectField
              label="Education Qualification *"
              options={educationOptions}
              selectedValue={formData.education || ""}
              onSelect={(value) => handleInputChange("education", value)}
              colors={ofs.themeColors}
              dark={dark}
              collapsible
            />
            <OptionSelectField
              label="Experience Status *"
              options={experienceStatusOptions}
              selectedValue={formData.experienceStatus || ""}
              onSelect={(value) => handleInputChange("experienceStatus", value)}
              colors={ofs.themeColors}
              dark={dark}
              collapsible
            />
            {formData.experienceStatus === "experienced" && (
              <>
                <OptionSelectField
                  label="Experience Years *"
                  options={experienceYearOptions}
                  selectedValue={formData.experienceYears || ""}
                  onSelect={(value) => handleInputChange("experienceYears", value)}
                  colors={ofs.themeColors}
                  dark={dark}
                  collapsible
                />
                <OwnerFormField
                  label="Experience Field *"
                  value={formData.experienceField}
                  onChangeText={(value) => handleInputChange("experienceField", value)}
                  placeholder="e.g., Sales, Teaching, IT, etc."
                  colors={ofs.themeColors}
                  dark={dark}
                />
              </>
            )}
          </OwnerFormCard>

          <View style={ofs.formActionsRow}>
            <TouchableOpacity
              style={[ofs.formActionBtn, ofs.formActionBtnOutline]}
              onPress={() => navigation.goBack()}
              disabled={isSaving}
            >
              <Text style={ofs.formActionBtnOutlineText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[ofs.formActionBtn, ofs.formActionBtnPrimary]}
              onPress={handleSubmit}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={ofs.formActionBtnText}>Save Profile</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Footer />
    </KeyboardAvoidingView>
  );
}
