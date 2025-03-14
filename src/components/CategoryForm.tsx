import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

type FormDataProps = {
  categoryName: string;
  noOfJobs: string;
  selectedImage: string | null;
  filename: string;
  fileType: string;
};

const CategoryForm: React.FC = () => {
  const [formData, setFormData] = useState<FormDataProps>({
    categoryName: '',
    noOfJobs: '',
    selectedImage: null,
    filename: '',
    fileType: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.categoryName.trim()) {
      newErrors.categoryName = 'Category name is required';
    }
    if (!formData.selectedImage) {
      newErrors.selectedImage = 'Category image is required';
    }
    if (!formData.noOfJobs.trim() || isNaN(Number(formData.noOfJobs)) || Number(formData.noOfJobs) <= 0) {
      newErrors.noOfJobs = 'Number of jobs must be a positive number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 
  const _pickImage = async (): Promise<void> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      // Check if the user canceled or no assets are present
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const { uri } = result.assets[0]; // Extract the URI from the first asset
        const filename = uri.split('/').pop() || '';
        const match = /\.(\w+)$/.exec(filename);
        const fileType = match ? `image/${match[1]}` : 'image';
  
        setFormData((prev) => ({
          ...prev,
          selectedImage: uri,
          filename,
          fileType,
        }));
      } else {
        Alert.alert('Cancelled', 'No image was selected.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open image picker');
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (validateForm()) {
      const formDataToSend = new FormData();
      formDataToSend.append('Name', formData.categoryName);
      formDataToSend.append('CategoryJobs', formData.noOfJobs);
  
     
      formDataToSend.append('CategoryImage', {
        uri: formData.selectedImage,
        name: formData.filename,
        type: formData.fileType,
      } as any);
      console.log('Selected Image URI:', formData.selectedImage);

      try {
        console.log('Data to post:', JSON.stringify(formDataToSend));
        const response = await fetch('http://192.168.0.101:5125/api/Category/Addcategory', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data', // Ensure correct content type
          },
          body: formDataToSend,
        });
        console.log(response.status);
        if (response.ok) {
          Alert.alert('Form Submitted', 'Your data has been successfully sent!');
          setFormData({
            categoryName: '',
            noOfJobs: '',
            selectedImage: null,
            filename: '',
            fileType: '',
          });
        } else {
          Alert.alert('Submission Failed', 'Please try again later.');
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred while submitting the form.');
      }
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category Name</Text>
      <TextInput
        style={[styles.input, errors.categoryName && styles.inputError]}
        placeholder="Enter category name"
        value={formData.categoryName}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, categoryName: text }))}
      />
      {errors.categoryName && <Text style={styles.errorText}>{errors.categoryName}</Text>}

      <Text style={styles.label}>Category Image</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={_pickImage}>
        <Text style={styles.imagePickerText}>
          {formData.selectedImage ? 'Change Image' : 'Pick an Image'}
        </Text>
      </TouchableOpacity>
      {formData.selectedImage && (
        <Image source={{ uri: formData.selectedImage }} style={styles.imagePreview} />
      )}
      {errors.selectedImage && <Text style={styles.errorText}>{errors.selectedImage}</Text>}

      <Text style={styles.label}>Number of Jobs</Text>
      <TextInput
        style={[styles.input, errors.noOfJobs && styles.inputError]}
        placeholder="Enter number of jobs"
        keyboardType="numeric"
        value={formData.noOfJobs}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, noOfJobs: text }))}
      />
      {errors.noOfJobs && <Text style={styles.errorText}>{errors.noOfJobs}</Text>}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  imagePicker: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#555',
    fontSize: 16,
  },
  imagePreview: {
    marginTop: 10,
    width: 100,
    height: 100,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: 'green',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CategoryForm;
