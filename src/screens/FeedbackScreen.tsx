import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";

const FeedbackScreen = ({ route }) => {
    const { userId } = route.params;
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [feedbacks, setFeedbacks] = useState([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchFeedbacks();
    }, [userId]);

    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get(`http://192.168.108.30:5209/api/Feedback/TargetFeedback/${userId}`);
            console.log("API Response:", response.data);
            setFeedbacks(response.data);
        } catch (error) {
            console.error('Error fetching feedback:', error);
        }
    };

    const submitFeedback = async () => {
        const token = await AsyncStorage.getItem('jwtToken');
        if (!token) {
            console.error('User token not found.');
            return;
        }

        const decodedToken = jwtDecode(token);
        const senderId = decodedToken.Id;

        if (rating === 0) {
            Alert.alert('Error', 'Please provide a star rating before submitting.');
            return;
        }

        try {
            const response = await axios.post('http://192.168.108.30:5209/api/Feedback/PostFeedback', {
                targetId: userId,
                senderId: senderId,
                rating,
                comment,
            });

            if (response.status === 200) {
                Alert.alert('Success', 'Feedback submitted successfully!');
                setRating(0);
                setComment('');
                setShowForm(false);
                fetchFeedbacks(); // Refresh feedback list
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            Alert.alert('Error', 'Failed to submit feedback. Please try again later.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>User Feedback</Text>

            {/* Feedback List */}
            <FlatList
    data={feedbacks}
    keyExtractor={(item) => item.Id?.toString() || Math.random().toString()}
    renderItem={({ item }) => (
        <View style={styles.feedbackCard}>
            <Text style={styles.sender}>{item.sender?.name || 'Anonymous'}</Text>
            <Text style={styles.date}>
                {item.createdDate ? new Date(item.createdDate).toDateString() : "Date not available"}
            </Text>
            <StarRating rating={item.rating || 0} starSize={18} />
            <Text style={styles.comment}>{item.comment || "No comment provided."}</Text>
        </View>
        
    )}
    ListEmptyComponent={
        <Text style={styles.noFeedbackText}>No feedback available for this user.</Text>
    }
/>

            {/* Add Comment Button */}
            {!showForm ? (
                <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)}>
                    <Text style={styles.addButtonText}>Add Your Comment</Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.feedbackForm}>
                    <StarRating rating={rating} onChange={setRating} starSize={30} />
                    <TextInput
                        placeholder="Write your comments here..."
                        value={comment}
                        onChangeText={setComment}
                        style={styles.input}
                        multiline
                    />
                   <View style={{ marginTop: 15 }}> 
                    
        <Button title="Submit Feedback" onPress={submitFeedback} />
    </View>
    <View style={{ marginTop: 15 }}> 
                    
    <Button title="Cancel" onPress={() => setShowForm(false)} color="green" /> 
    </View>

                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    feedbackCard: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    sender: { fontSize: 16, fontWeight: 'bold' },
    date: { fontSize: 12, color: 'gray', marginBottom: 5 },
    comment: { fontSize: 14, marginTop: 5 },
    addButton: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    addButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    feedbackForm: { marginTop: 10, backgroundColor: 'white', padding: 15, borderRadius: 10 },
    input: { backgroundColor: '#eee', padding: 10, borderRadius: 8, marginTop: 10, minHeight: 80, textAlignVertical: 'top' },
    noFeedbackText: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        marginVertical: 20,
    }
    
});

export default FeedbackScreen;
