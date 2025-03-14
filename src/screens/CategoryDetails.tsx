import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet,Image,TextInput,Modal, FlatList } from 'react-native';
import axios from 'axios';
import { RouteProp, useNavigation } from '@react-navigation/native';
import JobDetails from './JobDetails';

// Define TypeScript interfaces
interface Job {
  id: number;
  name: string;
  companyName: string;
  location: string;
}

interface Service {
  id: number;
  name: string;
  location: string;
  urgencyLevel: string;
}

interface ApiResponse {
  Jobs: Job[];
  Services: Service[];
}

// Define props for navigation route
type CategoryDetailsRouteProp = RouteProp<{ params: { categoryId: number; categoryName: string } }, 'params'>;

interface CategoryDetailsProps {
  route: CategoryDetailsRouteProp;
}

const CategoryDetails: React.FC<CategoryDetailsProps> = ({ route }) => {
    const navigation =useNavigation();
  const { categoryId, categoryName } = route.params;
  const [jobs, setJobs] = useState<Job[]>([]);
const [services, setServices] = useState<Service[]>([]);
const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const imageMap = {
    "service1.jpg": require('../../Images/Homeimages/m1.jpeg'),
    "service2.jpg": require('../../Images/Homeimages/m2.jpeg'),
    "service3.jpg": require('../../Images/Homeimages/m3.jpeg'),
    // Add other images here as needed
};
// const [selectedFilter, setSelectedFilter] = useState(null);
const [selectedFilter, setSelectedFilters] = useState({
  jobType: '',
  salary: '',
  city:'',
  datePosted:'',
});
const [originalJobs, setOriginalJobs] = useState<Job[]>([]);

const [modalVisible, setModalVisible] = useState(false);
const [selectedFilterType, setSelectedFilterType] = useState('');
const [selectedOption, setSelectedOption] = useState('');
const [applyNowVisible, setApplyNowVisible] = useState(false);
// Filters with options for each category
const filters = [
  { 
    label: 'Job Type', 
    icon: require('../../Images/Cetagories/location_on.png'), 
    dropdownIcon: require('../../Images/Cetagories/arrow_drop_down.png'), 
    options: ['Full-time', 'Part-time', 'Contract', 'Internship']
  },
  { 
    label: 'City', 
    icon: require('../../Images/Cetagories/location_on.png'), 
    dropdownIcon: require('../../Images/Cetagories/arrow_drop_down.png'), 
    options: ['New York', 'San Francisco', 'Los Angeles', 'Chicago'] 
  },
  { 
    label: 'Salary', 
    icon: require('../../Images/Cetagories/location_on.png'), 
    dropdownIcon: require('../../Images/Cetagories/arrow_drop_down.png'), 
    options: ['< 50K', '50K - 100K', '100K - 150K', '> 150K'] 
  },
  { 
    label: 'Date Posted', 
    icon: require('../../Images/Cetagories/location_on.png'), 
    dropdownIcon: require('../../Images/Cetagories/arrow_drop_down.png'), 
    options: ['Any Time ','Past 24 Hours', 'Last Week', 'Last Month'] 
  },
  
];

// Handle when a filter is clicked
const handleFilterClick = (filter) => {
  setSelectedFilterType(filter.label);
  setModalVisible(true); // Open the modal
};
const handleResetFilters = () => {
  setSelectedFilters({
    jobType: '',
    salary: '',
    city: '',
    datePosted: ''
  });
  setSelectedOption('');
  setSearchQuery('');
  setJobs(originalJobs); // Restore the original job list
};

// Handle the selection of a filter option
const handleOptionSelect = (option: string) => {
  setSelectedOption(prevSelected =>
    prevSelected.includes(option)
      ? prevSelected.filter(item => item !== option) // Deselect if already selected
      : [...prevSelected, option] // Select if not already selected
  );

  // Filter Type ke mutabiq state update karo
  setSelectedFilters(prev => {
    if (selectedFilterType === 'Job Type') {
      return { ...prev, jobType: option };
    } else if (selectedFilterType === 'Salary') {
      return { ...prev, salary: option };
    }
    else if(selectedFilterType === 'City')
    {
      return { ...prev, city: option };
    }
    else if (selectedFilterType === 'Date Posted') {  // ✅ Date Filter Set Karna
      return { ...prev, datePosted: option };
    }
    return prev;
    
  });
};



const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const handleApplyNowClick = () => {
  setApplyNowVisible(true); // Show ApplyNowForm modal
};
// Placeholder function to show the results based on the selected filter
const handleShowResults = () => {
  setModalVisible(false); // Modal band karo
  
  // Salary filter ke liye numeric conversion
  let minSalary = 0, maxSalary = Infinity;
  if (selectedFilter.salary === '< 50K') {
    maxSalary = 50000;
  } else if (selectedFilter.salary === '50K - 100K') {
    minSalary = 50000;
    maxSalary = 100000;
  } else if (selectedFilter.salary === '100K - 150K') {
    minSalary = 100000;
    maxSalary = 150000;
  } else if (selectedFilter.salary === '> 150K') {
    minSalary = 150000;
  }

  // Filtering Jobs
  const filtered = originalJobs.filter(job =>
    (selectedFilter.jobType ? job.jobType === selectedFilter.jobType : true) &&
    (selectedFilter.salary ? (job.minSalary >= minSalary && job.maxSalary <= maxSalary) : true)
  );

  setJobs(filtered);
};


const handleApplyFilter = () => {
  alert(`Applied filter: ${selectedFilterType} - ${selectedOption}`);
  setModalVisible(false); // Close the modal after applying
};

useEffect(() => {
  const fetchPosts = async () => {
    try {
      const response = await axios.get<ApiResponse>(
        `http://192.168.100.22:5140/api/Category/${categoryId}/posts`
      );

      console.log('API Response:', response.data); // Debugging

      // ✅ Extracting "$values" from "Jobs" and "Services"
    //  setJobs(response.data?.Jobs?.$values || []); 
      const jobsData = response.data?.Jobs?.$values || [];
      setJobs(jobsData);
      setOriginalJobs(jobsData);
      setServices(response.data?.Services?.$values || []);
       setSelectedFilters({
        jobType: '',
        salary: '',
        city: '',
        datePosted: '' // ✅ New field added
       });

      setSearchQuery('')
    }
    // } catch (err) {
    //   setError('Failed to load data');
      catch (err) {
        console.error("Error fetching jobs and services:", err.response?.data || err.message);
        setError("Failed to load data");
      }
      
    //   console.error('Error fetching jobs and services:', err);
     finally {
      setLoading(false);
    }
  };

  fetchPosts();
}, [categoryId]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;
  const formatDate = (utcDate) => {
    const date = new Date(utcDate); // Convert UTC date string to Date object
    const day = String(date.getDate()).padStart(2, '0'); // Get day with leading zero
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed, so +1)
    const year = date.getFullYear(); // Get full year
    return `${month}/${day}/${year}`; // Return formatted date as MM/DD/YYYY
};
const getDateFilterRange = (selectedDateFilter) => {
  const now = new Date();
  if (selectedDateFilter === "Past 24 Hours") {
    return new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 din pehle ka time
  } else if (selectedDateFilter === "Last Week") {
    return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 din pehle ka time
  } else if (selectedDateFilter === "Last Month") {
    return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 din pehle ka time
  }
  return null; // "Any Time" wala case
};


const filteredJobs = (jobs|| []).filter(job => {
  // ✅ Search Query Filter
  const matchesSearchQuery = !searchQuery || 
    job?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
    job?.location?.toLowerCase()?.includes(searchQuery.toLowerCase());

  // ✅ Job Type Filter
  const matchesJobType = !selectedFilter.jobType || job?.jobType === selectedFilter.jobType;
  const jobCity = job?.location?.split(",")[0].trim().toLowerCase(); 
  const matchesCity = !selectedFilter.city || jobCity === selectedFilter.city.toLowerCase();
  // ✅ Salary Filter
  let minSalary = 0, maxSalary = Infinity;
  if (selectedFilter.salary === "< 50K") {
    maxSalary = 50000;
  } else if (selectedFilter.salary === "50K - 100K") {
    minSalary = 50000;
    maxSalary = 100000;
  } else if (selectedFilter.salary === "100K - 150K") {
    minSalary = 100000;
    maxSalary = 150000;
  } else if (selectedFilter.salary === "> 150K") {
    minSalary = 150000;
  }

  const jobMin = job.minSalary || 0;
  const jobMax = job.maxSalary || Infinity;
  const matchesSalary = !selectedFilter.salary || 
    (jobMin >= minSalary && jobMax <= maxSalary);

  // ✅ All conditions should match
  
  let matchesDate = true;
  if (selectedFilter.datePosted && selectedFilter.datePosted !== "Any Time") {
    const filterDate = getDateFilterRange(selectedFilter.datePosted);
    const jobDate = new Date(job.datePosted); // Job ki date (UTC format)
    
    if (filterDate) {
      matchesDate = jobDate >= filterDate; // Filter date ke baad ki jobs show hongi
    }
  }

  return matchesSearchQuery && matchesJobType && matchesSalary && matchesCity && matchesDate;
});

console.log("Search Query:", searchQuery);
console.log("Selected Filter:", selectedFilter);

console.log("Jobs Before Filter:", jobs);
console.log("Jobs After Filter:", filteredJobs);
console.log("Search Query:", searchQuery.toLowerCase().trim());



// ✅ Search Query ko bhi clear kar dein agar chahye




 // ✅ Ensure jobs is always an array
 

const filteredServices = searchQuery
? (services || []).filter(service =>
    service?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
    service?.location?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
    service?.urgencyLevel?.toLowerCase()?.includes(searchQuery.toLowerCase())
  )
: services || []; // ✅ Ensure services is always an array



// ✅ Default: Show all services if no search query

return (
<ScrollView contentContainerStyle={styles.container}>
  {/* 🔹 Search Bar */}
  <View style={styles.inputContainer}>
    <Image source={require('../../Images/Cetagories/Search.png')} style={styles.iconStyle} />
    <TextInput
      placeholder="Search jobs or services..."
      style={styles.inputStyle}
      value={searchQuery}
      onChangeText={setSearchQuery} // 🔹 Filter on text change
    />
  </View>
  <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {filters.map((filter, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.filterButton, selectedFilter === filter.label && styles.selectedFilter]}
            onPress={() => handleFilterClick(filter)}>
            <View style={styles.filterContent}>
   
    
              <Image
                source={filter.icon}
                style={[styles.iconStyle, selectedFilter === filter.label && styles.selectedIcon]}
              />
              <Text
                style={[styles.filterText, selectedFilter === filter.label && styles.selectedText]}>
                {filter.label}
              </Text>
              <Image
                source={filter.dropdownIcon}
                style={[styles.dropdownIconStyle, selectedFilter === filter.label && styles.selectedDropdownIcon]}
              />
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
    style={styles.resetButton}
    onPress={handleResetFilters}>
    <Text style={styles.resetButtonText}>Reset All Filters</Text>
  </TouchableOpacity>
      </ScrollView>

      {/* Modal for Dropdown */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>{selectedFilterType} Options</Text>
            <FlatList
              data={chunkArray(
                filters.find(filter => filter.label === selectedFilterType)?.options || [],
                2
              )}
              keyExtractor={(item, index) => `row-${index}`}
              renderItem={({ item }) => (
                <View style={styles.rowContainer}>
                  {item.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.modalOption}
                      onPress={() => handleOptionSelect(option)}>
                      <Text style={styles.modalOptionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
            <TouchableOpacity style={styles.showResultsButton} onPress={handleShowResults}>
              <Text style={styles.showResultsButtonText}>Show 100 Results</Text>
            </TouchableOpacity>

            {/* Apply Now Button */}
            {/* Apply Now Form Modal */}
    

      {/* Apply Now Button */}
      
          </View>
        </View>
      </Modal>
  

  {/* 🔹 Jobs List */}
  <Text style={styles.subHeader}>{categoryName} Jobs</Text>
      <View style={styles.listContainer}>
        {/* <Text style={styles.subHeader}>Jobs</Text> */}
        
        {filteredJobs?.length > 0 ? (
  filteredJobs.map((job) => (
    <TouchableOpacity 
  key={job.id} 
  style={styles.postContainer} 
  onPress={() => navigation.navigate('JobDetails', { job, type: job.type})} // 👈 Extra type parameter
>

      {/* Job Header */}
      <View style={styles.header}>
        <Image
          source={job.userImage ? { uri: job.userImage } : require('../../Images/Homeimages/m1.jpeg')}
          resizeMode="cover"
          style={styles.Postimage}
        />
        <View style={styles.jobtitleContainer}>
          <Text style={styles.Jobtitle}>{job.name}</Text>
          <Text style={styles.companyName}>{job.companyName}</Text>
        </View>
        {/* Job Type Badge */}
        <View style={[styles.jobTypeBadge, job.jobType === "Full-time" ? styles.fullTime : styles.partTime]}>
          <Text style={styles.jobTypeText}>{job.jobType}</Text>
        </View>
      </View>

      {/* Salary & Workplace Type */}
      <Text style={styles.price}>Rs. {job.minSalary} - {job.maxSalary} ({job.workplaceType})</Text>

      {/* Footer Details */}
      <View style={styles.footer}>
        <View style={styles.location}>
          <Image
            source={require('../../assests/icons/maps-and-flags.png')}
            resizeMode="contain"
            style={styles.image}
          />
          <Text style={styles.footerText}>{job.location}</Text>
        </View>
        <View style={styles.location}>
          <Image
            source={require('../../assests/icons/clock.png')}
            resizeMode="contain"
            style={styles.image}
          />
          <Text style={styles.footerText}>{formatDate(job.datePosted)}</Text>
        </View>
      </View>

      <View style={styles.line} />

      {/* Apply Now & Save Buttons */}
      <View style={styles.Buttons}>
        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Apply Now</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require('../../assests/icons/share.png')}
            resizeMode="contain"
            style={styles.ShareBtn}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require('../../assests/icons/bookmark.png')}
            resizeMode="contain"
            style={styles.ShareBtn}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  ))
) : (
  <Text>No jobs available...</Text>
)}

{/* <Text style={styles.subHeader}>Services</Text> */}
{filteredServices?.length > 0 ? (

  filteredServices.map((service) => (
    <TouchableOpacity 
      key={service.id} 
      style={styles.postContainer} 
      onPress={() => navigation.navigate('JobDetails', { service , type: service.type})} // 👈 Add this line
    >
    {/* <View  style={styles.postContainer}> */}
                            {/* Same layout for jobs */}
                            <View style={styles.header}>
                                <Image
                                    source={imageMap[service.imageName] || require('../../Images/Homeimages/m1.jpeg')}
                                    resizeMode="cover"
                                    style={styles.Postimage}
                                />
                                <View style={styles.jobtitleDifference}>
                                    <Text style={styles.Jobtitle}>{service.name}</Text>
                                    <View style={styles.circle1}>
                                        <Text style={styles.circleText1}>5</Text>
                                    </View>
                                </View>
                            </View>
                            <Text style={styles.price}>Rs. {service.minSalary} - {service.maxSalary} </Text>
                            <Text style={styles.description}>{service.description}</Text>
                            <View style={styles.footer}>
                            <View style={styles.location}>
                                <Image
                                    source={require('../../assests/icons/maps-and-flags.png')}
                                    resizeMode="contain"
                                    style={styles.image}
                                />
                                <Text style={[styles.footerText, { fontWeight: 'bold', fontSize: 12, color: 'red' }]}>{service.location}</Text>
                            </View>
                            <View style={styles.location}>
                                <Image
                                    source={require('../../assests/icons/clock.png')}
                                    resizeMode="contain"
                                    style={styles.image}
                                />
                                <Text style={styles.footerText}>{formatDate(service.datePosted)}</Text>
                            </View>
                        </View>
                        
                        <View style={styles.line} />
    
                        
                        <View style={styles.Buttons}>
        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Apply Now</Text>
        </TouchableOpacity>
                            <TouchableOpacity>
                                <Image
                                    source={require('../../assests/icons/share.png')}
                                    resizeMode="contain"
                                    style={styles.ShareBtn}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image
                                    source={require('../../assests/icons/bookmark.png')}
                                    resizeMode="contain"
                                    style={styles.ShareBtn}
                                />
                            </TouchableOpacity>
                        </View>
                       
                   
                   </TouchableOpacity>
                    ))
                ) : (
                    <Text>Loading jobs...</Text>
                )}


      </View>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  inputStyle:{
    width:'80%',
    height:50,
   color:'black',
  // borderWidth:2,
//    borderColor:'#6ab04c',
   borderRadius:10,
   margin:1,
   textAlign:'center',
//    backgroundColor:'rgba(44, 227, 179, 0.24)'}
}
   ,
inputContainer: {
flexDirection: 'row',
alignItems: 'center',
backgroundColor: 'lightgreen',// Light greenish background
borderWidth: 1,
borderColor: 'green',
borderRadius: 25,
paddingLeft: 15,
paddingRight: 10,
color:'black',
height: 50,
margin:10,
width:'90%',
},
iconStyle: {
width: 24, // Adjust based on your icon size
height: 24,
marginRight: 10,

color:'green'
},
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
  },
  listContainer: {
    padding: 10,
  },
  item: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
},
ShareBtn: {
    height: 20,
    width: 20,
    tintColor: '#6ab04c',
},
Buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    gap: 5,
},

line: {
    height: 1,
    backgroundColor: '#999',
    width: '100%',
    marginVertical: 5,
},
jobtitleDifference: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
},
textCircle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 5,
},
Postimage: {
    width: 50,
    height: 50,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#BA2F16',
},
image: {
    width: 10,
    height: 10,
    tintColor: '#616C6F',
    padding: 0,
    margin: 0,
},
container: {
    padding: 7,
    margin: 6
},
postContainer: {
    borderWidth: 1,
    borderColor: '#6AE87B',
    borderRadius: 10,
    padding: 7,
    marginBottom: 15,
    backgroundColor: '#fff',
    shadowColor: '#888',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
},
header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
},
Jobtitle: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#333',
    marginLeft: 3,
},
circle1: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 5,
    borderColor: '#6AE87B',
    justifyContent: 'center',
    alignItems: 'center',
},
circleText1: {
    color: '#333',
    fontSize: 20,
},
price: {
    // fontWeight: 'bold',
    fontSize: 14,
    // color: '#1A8917',
    marginVertical: 5,
    marginTop:7
},
description: {
    fontSize: 11,
    color: '#555',
    marginBottom: 3,
},
footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    margin: 5,
},
location: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize:12
},
footerText: {
    fontSize: 10,
    color: '#999',
},
jobtitleContainer: {
    flex: 1,
    marginLeft: 5,
},
companyName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
},
jobTypeBadge: {
    // paddingVertical: 0,
    // paddingHorizontal: 5,
    borderRadius: 5,
    alignSelf: 'center',
    color:'black'
},
fullTime: {
    // backgroundColor: '#6AE87B',
    color:'green'
},
partTime: {
    // backgroundColor: '#FF6F61',
},
jobTypeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color:'green'
   
},
applyButton: {
     backgroundColor: 'rgba(255, 0, 0,0.6)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
},
applyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
},
scrollContent: {
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
},
filterButton: {
  paddingHorizontal: 20,
  paddingVertical: 12,
  backgroundColor: 'white',
  borderRadius: 15,
  marginRight: 15,
  minWidth: 120,
  borderWidth: 2,
  borderColor:'#65a765',
},
selectedFilter: {
  backgroundColor: '#2CE3B3',
},
filterText: {
  fontSize: 14,
  color: '#333',
},
selectedText: {
  color: '#fff',
  fontWeight: 'bold',
  backgroundColor:'green'
},
selectedOption: {
  backgroundColor: '#007bff', // Blue background when selected
},
filterContent: {
  flexDirection: 'row',
  alignItems: 'center',
},
iconStyle: {
  width: 20,
  height: 20,
  marginLeft: 1,
},
selectedIcon: {
  tintColor: 'green',
  backgroundColor:'green'
},
dropdownIconStyle: {
  width: 18,
  height: 18,
  marginLeft: 5,
  tintColor: '#333',
},
selectedDropdownIcon: {
  tintColor: 'green',
},
modalContainer: {
  flex: 1,
  justifyContent: 'flex-end',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalContent: {
  backgroundColor: '#fff',
  paddingVertical: 20,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  height: '50%',
},
modalHeader: {
  fontSize: 18,
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: 10,
},
modalOption: {
  paddingVertical: 15,
  paddingHorizontal: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#f0f0f0',
  flex: 1,
  alignItems: 'center',
},
modalOptionText: {
  width: '80%',
  textAlign: 'center',
  fontSize: 16,
  color: 'black',
  borderWidth: 2,
  borderColor: 'black',
  padding: 10,
  borderRadius: 10,
},
showResultsButton: {
  marginTop: 20,
  paddingVertical: 12,
  backgroundColor: '#10A881',
  borderRadius: 15,
  alignItems: 'center',
},
showResultsButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
applyNowButton: {
  marginTop: 15,
  paddingVertical: 12,
  backgroundColor: '#10A881', // Green color for Apply button
  borderRadius: 15,
  alignItems: 'center',
},
applyNowButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
rowContainer: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginBottom: 10,
},
scrollContent: {
  flexDirection: 'row',
  alignItems: 'center',
},
filterButton: {
  paddingHorizontal: 20,
  paddingVertical: 12,
  backgroundColor: 'white',
  borderRadius: 15,
  marginRight: 15,
  borderWidth: 2,
  borderColor: '#10A881'
},
filterText: {
  fontSize: 14,
  color: '#333',
},
applyNowButton: {
  marginTop: 15,
  paddingVertical: 12,
  backgroundColor: '#4CAF50',
  borderRadius: 15,
  alignItems: 'center',
},
resetButton: {
  padding: 10,
  // Reset button color
  borderRadius: 5,
  marginLeft: 6,
  // borderRadius: 10,
  // borderWidth:2,
  // borderColor: '#10A881'


},
resetButtonText: {
  color: 'green',
  fontWeight:'bold',
  fontSize: 14,
},

});

export default CategoryDetails;