import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

const categories = [
  'Movies', 'TV Series', 'Documentary', 'Sports', 'Animation', 'Kids', 'Comedy', 'Drama', 'Horror', 'Sci-Fi'
];

const movieItems = [
  { id: '1', title: 'Soul', year: '2020', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNhbrdJc-8s2R0yvdMoM18LyWFcIkpHfYcyH7Exc4OlN7CLNfLPPvRc0vC087pepetHiE&usqp=CAU', category: 'Animation' },
  { id: '2', title: 'Knives Out', year: '2019', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpvn6U_-uaQ5eOA42BCRGK5Ofamo0yxtXCtw&s', category: 'Movies' },
  { id: '3', title: 'Onward', year: '2020', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNhbrdJc-8s2R0yvdMoM18LyWFcIkpHfYcyH7Exc4OlN7CLNfLPPvRc0vC087pepetHiE&usqp=CAU', category: 'Animation' },
  { id: '4', title: 'Mulan', year: '2020', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNhbrdJc-8s2R0yvdMoM18LyWFcIkpHfYcyH7Exc4OlN7CLNfLPPvRc0vC087pepetHiE&usqp=CAU', category: 'Movies' },
  { id: '5', title: 'Stranger Things', year: '', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNhbrdJc-8s2R0yvdMoM18LyWFcIkpHfYcyH7Exc4OlN7CLNfLPPvRc0vC087pepetHiE&usqp=CAU', category: 'TV Series' },
  { id: '6', title: 'The Flash', year: '', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNhbrdJc-8s2R0yvdMoM18LyWFcIkpHfYcyH7Exc4OlN7CLNfLPPvRc0vC087pepetHiE&usqp=CAU', category: 'TV Series' },
  { id: '7', title: 'Money Heist', year: '', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNhbrdJc-8s2R0yvdMoM18LyWFcIkpHfYcyH7Exc4OlN7CLNfLPPvRc0vC087pepetHiE&usqp=CAU', category: 'TV Series' },
  { id: '8', title: 'Doctor Who', year: '', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNhbrdJc-8s2R0yvdMoM18LyWFcIkpHfYcyH7Exc4OlN7CLNfLPPvRc0vC087pepetHiE&usqp=CAU', category: 'TV Series' },
];

const TabContent = () => {
  const [selectedCategory, setSelectedCategory] = useState('Movies');
  const router = useRouter();

  // Filter movieItems by category
  const filteredMovies = movieItems.filter(movie => movie.category === selectedCategory);

  const renderCategory = (category: string) => (
    <TouchableOpacity key={category} onPress={() => setSelectedCategory(category)}>
      <Text style={[styles.tabText, selectedCategory === category && styles.activeTab]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  // Handle navigation to the MovieDetail screen
  const navigateToDetails = (movieId: string) => {
    router.push(`/MovieDetail/${movieId}`);
  };

  return (
    <SafeAreaView style={styles.safeArea} className="w-full h-screen-safe">
      <View style={styles.container}>
        {/* Sticky Header with Search */}
        <View style={styles.stickyHeader}>
          <Text style={styles.headerText}>Find Movies, TV series, and more..</Text>
          <TextInput style={styles.searchInput} placeholder="Search for something..." placeholderTextColor="#888" />
          
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
                <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="contain" />
              </View>
              <Text style={styles.itemText}>{item.title} {item.year && `(${item.year})`}</Text>
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
    backgroundColor: '#1a1a2e', // Match background color to device menu
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
  
  // New styles for image container to ensure border radius with resizeMode 'contain'
  imageContainer: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',  // Ensures the image stays within the container's border radius
  },
  itemImage: {
    width: '100%',
    height: 200,
  },
  itemText: { color: '#fff', marginTop: 8, textAlign: 'center' },
});