import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const saveIpAddress = async (ip: string) => {
  try {
    await AsyncStorage.setItem('192.168.0.106', ip);
  } catch (e) {
    console.error('Error saving IP address:', e);
  }
};

export const getIpAddress = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('ipAddress');
  } catch (e) {
    console.error('Error fetching IP address:', e);
    return null;
  }
};
