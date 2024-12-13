import React from 'react';
import { View, Text, Image, ScrollView, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { auth, db } from "../../firebase/firebase";

const userData = {
  name: 'John Doe',
  username: '@johndoe',
  avatar: 'https://i.pravatar.cc/150?img=4',
};

const myList = [
  { title: 'Inception', image: 'https://example.com/inception.jpg' },
  { title: 'The Dark Knight', image: 'https://example.com/dark-knight.jpg' },
  // Add more items
];

const downloadedMovies = [
  { title: 'Soul', image: 'https://example.com/soul.jpg' },
  { title: 'Avatar', image: 'https://example.com/avatar.jpg' },
  // Add more items
];

const continueWatching = [
  { title: 'Breaking Bad', image: 'https://example.com/breaking-bad.jpg', progress: '50%' },
  { title: 'The Office', image: 'https://example.com/the-office.jpg', progress: '80%' },
  // Add more items
];


const ProfilePage = () => {
  const handleSignout = async () => {
    await auth.signOut();
  };

  const renderMovieItem = (item: { title: string; image: string }) => (
    <TouchableOpacity style={styles.movieCard}>
      <Image source={{ uri: item.image }} style={styles.movieImage} />
      <Text style={styles.movieTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Notification Bar */}
      <View style={styles.notificationBar}>
        <Text style={styles.notificationText}>You have 3 new notifications</Text>
        <FontAwesome name="bell" size={24} color="white" />
      </View>

      {/* Profile Details */}
      <View style={styles.profileContainer}>
        <Image source={{ uri: userData.avatar }} style={styles.avatar} />
        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={styles.userHandle}>{userData.username}</Text>
        <TouchableOpacity onPress={handleSignout} className='w-24 h-10 mt-4 rounded-full border border-[#FF6A3D] text-[12px] flex items-center justify-center'>
          <Text className='text-[#fff] text-[15px] font-semibold'>Sign Out</Text>
        </TouchableOpacity>

      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* My List Section */}
        <Text style={styles.sectionTitle}>My List</Text>
        <FlatList
          horizontal
          data={myList}
          renderItem={({ item }) => renderMovieItem(item)}
          keyExtractor={(item) => item.title}
          showsHorizontalScrollIndicator={false}
        />

        {/* Downloaded Movies Section */}
        <Text style={styles.sectionTitle}>Downloaded Movies</Text>
        <FlatList
          horizontal
          data={downloadedMovies}
          renderItem={({ item }) => renderMovieItem(item)}
          keyExtractor={(item) => item.title}
          showsHorizontalScrollIndicator={false}
        />

      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1a1a2e' },
  notificationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  notificationText: { color: 'white', fontSize: 16 },
  profileContainer: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  userHandle: { fontSize: 16, color: '#888' },
  scrollContainer: { paddingHorizontal: 10 },
  sectionTitle: {
    fontSize: 18,
    color: 'white',
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  movieCard: {
    marginRight: 15,
    alignItems: 'center',
  },
  movieImage: {
    width: 100,
    height: 150,
    borderRadius: 10,
  },
  movieTitle: {
    marginTop: 5,
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
  continueCard: {
    marginRight: 15,
    alignItems: 'center',
  },
  continueImage: {
    width: 100,
    height: 150,
    borderRadius: 10,
    position: 'relative',
  },
  progressOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 5,
    backgroundColor: '#444',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'orange',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});
