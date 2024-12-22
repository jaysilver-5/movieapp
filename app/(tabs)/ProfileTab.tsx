import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { auth } from '../../firebase/firebase';
import { useMyListStore } from '../../store/myListStore';
import { useRouter, Stack } from 'expo-router';
import { db } from '../../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';



const userData = {
  name: 'John Doe',
  username: '@johndoe',
  avatar: 'https://i.pravatar.cc/150?img=4',
};

const downloadedMovies = [
  { title: 'Soul', image: 'https://example.com/soul.jpg' },
  { title: 'Avatar', image: 'https://example.com/avatar.jpg' },
];

const ProfilePage = () => {
  const [movies, setMovies] = useState([]);
  const { myList, loadList } = useMyListStore(); // Access myList and loadList from the store
  const router = useRouter();
  console.log(movies)

  useEffect(() => {
    // Load the list when the component mounts
    loadList();
  }, [loadList]);

  useEffect(() => {
    // Log myList whenever it changes
    console.log('My List:', myList);
  }, [myList]);

  const handleSignout = async () => {
    await auth.signOut();
  };

  useEffect(() => {
      const fetchMoviesFromList = async () => {
        try {
          const moviePromises = myList.map(async (id) => {
            const docRef = doc(db, 'movies', id);
            const movieDoc = await getDoc(docRef);
            return movieDoc.exists() ? { id, ...movieDoc.data() } : null;
          });

          const fetchedMovies = (await Promise.all(moviePromises)).filter(Boolean); // Remove null values
          setMovies(fetchedMovies);
        } catch (error) {
          console.error('Error fetching movies:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchMoviesFromList();
      console.log(movies)
    }, []);


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
        <TouchableOpacity onPress={handleSignout} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* My List Section */}
        <Text style={styles.sectionTitle}>My List</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {movies.map((movie) => (
            <TouchableOpacity
              key={movie.id || Math.random().toString()}
              style={styles.movieCard}
              onPress={() => router.push(`/MovieDetail/${movie.id}`)}
            >
              <Image source={{ uri: movie.posterUrl }} style={styles.movieImage} />
              <View style={styles.titleContainer}>
                <Text style={styles.movieTitleText}>{movie.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Downloaded Movies Section */}
        <Text style={styles.sectionTitle}>Downloaded Movies</Text>
        <FlatList
          horizontal
          data={downloadedMovies}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.movieCard}>
              <Image source={{ uri: item.image }} style={styles.movieImage} />
              <Text style={styles.movieTitle}>{item.title}</Text>
            </TouchableOpacity>
          )}
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
    width: 150,
    marginRight: 16,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  movieImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  movieTitle: {
    marginTop: 5,
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
  titleContainer: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 20,
    backgroundColor: '#dadada78',
    borderRadius: 15,
    textAlign: 'center',
    paddingVertical: 8,
  },
  movieTitleText: {
    fontSize: 11,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  signOutButton: {
    width: 100,
    height: 40,
    marginTop: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#FF6A3D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutText: { color: 'white', fontSize: 15, fontWeight: 'bold' },
});
