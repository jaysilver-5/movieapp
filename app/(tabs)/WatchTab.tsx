import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const categories = [
  'All',
  'Movies',
  'TV Series',
  'Documentary',
  'Sports',
  'Animation',
  'Kids',
  'Comedy',
  'Drama',
  'Horror',
  'Sci-Fi',
];

const TabContent = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'movies'));
        const fetchedMovies = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMovies(fetchedMovies);
        setFilteredMovies(fetchedMovies); // Default to all movies
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    // Filter movies by category and search query
    const categoryFilteredMovies = selectedCategory === 'All'
      ? movies
      : movies.filter((movie) => movie.categories?.includes(selectedCategory));

    const searchFilteredMovies = categoryFilteredMovies.filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredMovies(searchFilteredMovies);
  }, [selectedCategory, searchQuery, movies]);

  const renderCategory = (category) => (
    <TouchableOpacity key={category} onPress={() => setSelectedCategory(category)}>
      <Text style={[styles.tabText, selectedCategory === category && styles.activeTab]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  const navigateToDetails = (movieId) => {
    router.push(`/MovieDetail/${movieId}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#FF6A3D" style={styles.loader} />
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Sticky Header with Search */}
        <View style={styles.stickyHeader}>
          <Text style={styles.headerText}>Find Movies, TV series, and more..</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for something..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* Horizontal Scroll for Categories */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map(renderCategory)}
          </ScrollView>
        </View>

        {/* Movie Items List */}
        <FlatList
          data={filteredMovies}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.itemsContainer}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.itemCard} onPress={() => navigateToDetails(item.id)}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.posterUrl }} style={styles.itemImage} resizeMode="contain" />
              </View>
              <Text style={styles.itemText}>{item.title} {item.releaseDate && `(${item.releaseDate})`}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default TabContent;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  stickyHeader: { padding: 16, backgroundColor: '#1a1a2e' },
  headerText: { fontSize: 20, color: '#fff', fontWeight: 'bold', marginBottom: 16 },
  searchInput: { backgroundColor: '#333', padding: 10, borderRadius: 8, color: '#fff', marginBottom: 16 },
  categoryScroll: { flexDirection: 'row', marginBottom: 16 },
  tabText: { color: '#888', fontSize: 16, marginHorizontal: 10 },
  activeTab: { color: '#fff', borderBottomWidth: 2, borderBottomColor: 'orange' },
  itemsContainer: { paddingHorizontal: 10 },
  itemCard: { width: '48%', marginBottom: 12, marginHorizontal: '1%', borderRadius: 20 },
  imageContainer: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: 200,
  },
  itemText: { color: '#fff', marginTop: 8, textAlign: 'center' },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
    color: '#FFFFFF',
    marginTop: 10,
  },
});
