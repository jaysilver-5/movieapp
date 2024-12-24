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
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { auth } from '../../firebase/firebase';
import { useMyListStore } from '../../store/myListStore';
import { useRouter } from 'expo-router';
import { db } from '../../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useUserStore } from "../../store/store";

const userData = {
  name: 'John Doe',
  username: '@johndoe',
  avatar: 'https://i.pravatar.cc/150?img=4',
};

const avatars = [
  "https://img.freepik.com/free-vector/mysterious-gangster-character_23-2148466806.jpg?t=st=1734967901~exp=1734971501~hmac=1c4d01c24b3d428582e2ea36b880f36e96fb10185694bcf98023c73a9540a0f2&w=740",
  "https://img.freepik.com/free-vector/young-prince-vector-illustration_1308-174367.jpg?t=st=1734967845~exp=1734971445~hmac=4c1561e39a0f97068b107849e55de6f499fc6823b4a23a0ea63ad3f22032eb6d&w=360",
  "https://img.freepik.com/free-photo/portrait-beautiful-young-business-woman-eyeglasses_1142-42798.jpg?t=st=1734967558~exp=1734971158~hmac=51417622de5b01959403c491e4b2b084008e0ab4f129e8b86620dcb31b1f9ece&w=740",
  "https://img.freepik.com/free-vector/young-prince-vector-illustration_1308-174367.jpg?t=st=1734967845~exp=1734971445~hmac=4c1561e39a0f97068b107849e55de6f499fc6823b4a23a0ea63ad3f22032eb6d&w=360",
  "https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100279.jpg?t=st=1734967978~exp=1734971578~hmac=191e86b7baedd3223a2a95d6d4b3d4fa05c1b19123c131b0df8bd2fe9502eedb&w=740",
  "https://img.freepik.com/free-photo/ai-generated-concept-human_23-2150688375.jpg?t=st=1734968103~exp=1734971703~hmac=b3c53f6c3dec6b657d50c4ab8d592fe8479654e65729fb91b435940d679379d7&w=360",
  "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436200.jpg?t=st=1734968173~exp=1734971773~hmac=322a0e5498acc51c844cbe3cc1fd5397725a41061c96ea7eaf274f91a1bc7342&w=740",
];

const ProfilePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const { myList, loadList } = useMyListStore(); // Access myList and loadList from the store
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    // Load the list when the component mounts
    loadList();
  }, [loadList]);

  useEffect(() => {
    // Fetch movies whenever `myList` changes
    const fetchMoviesFromList = async () => {
      setLoading(true);
      try {
        const moviePromises = myList.map(async (id) => {
          const docRef = doc(db, 'movies', id);
          const movieDoc = await getDoc(docRef);
          return movieDoc.exists() ? { id, ...movieDoc.data() } : null;
        });

        const fetchedMovies = (await Promise.all(moviePromises)).filter(Boolean);
        setMovies(fetchedMovies);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesFromList();
  }, [myList]);
    console.log(user?.email)
  const handleSignout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  console.log(user?.avatarIndex)

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Activity Indicator */}
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FF6A3D" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
      {/* Profile Details */}
      <View style={styles.profileContainer}>
        <Image source={{ uri: avatars[user?.avatarIndex] }} style={styles.avatar} />
        <Text style={styles.userName}>{user?.displayName}</Text>
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
              key={movie.id}
              style={styles.movieCard}
              onPress={() => router.push(`/MovieDetail/${movie.id}`)}
            >
              <Image
                source={{ uri: movie.posterUrl || 'https://via.placeholder.com/150' }}
                style={styles.movieImage}
              />
              <View style={styles.titleContainer}>
                <Text style={styles.movieTitleText}>{movie.title || 'Untitled'}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1a1a2e' },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
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
    marginTop: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#FF6A3D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutText: { color: 'white', fontSize: 15, fontWeight: 'bold' },
  loadingText: { color: 'white', textAlign: 'center', marginTop: 10 },
});
