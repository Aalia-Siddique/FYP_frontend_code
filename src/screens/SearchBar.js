import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';

const SearchBar = () => {
  return (
    <View style={styles.wrapper}>
      {/* Left-side Icons (Outside Search Bar) */}
      <TouchableOpacity style={styles.iconButton}>
        <Image source={require('../../assests/icons/bell.png')} style={[styles.icon, {tintColor: 'green'}]} />
      </TouchableOpacity>

      {/* Search Bar */}
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Search..."
          placeholderTextColor="gray"
        />
        <TouchableOpacity>
          <Image source={require('../../assests/icons/search.png')} style={[styles.icon, {tintColor: 'green'}]} />
        </TouchableOpacity>
      </View>

      {/* Right-side Icons (Outside Search Bar) */}
      <TouchableOpacity style={styles.iconButton}>
        <Image source={require('../../assests/icons/voice.png')} style={[styles.icon, {tintColor: 'green'}]} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton}>
        <Image source={require('../../assests/icons/world.png')} style={[styles.icon, {tintColor: 'green'}]} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginHorizontal: 8,
    marginVertical: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    flex: 1,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 8, // Space from outside icons
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    color: 'black',
  },
  iconButton: {
    padding: 5,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default SearchBar;
