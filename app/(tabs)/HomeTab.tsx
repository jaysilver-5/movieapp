import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter, Stack } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { create } from 'zustand';

// Define the movie type
interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  bannerUrl?: string;
  synopsis?: string;
  releaseDate?: string;
  trailerUrl?: string;
  downloadUrl?: string;
  categories?: string[];
}

// Zustand Store
interface MovieStore {
  movies: Movie[];
  loading: boolean;
  lastOpenedMovie?: Movie;
  setLastOpenedMovie: (movie: Movie) => void;
  fetchMovies: () => Promise<void>;
}

const useMoviesStore = create<MovieStore>((set) => ({
  movies: [],
  loading: true,
  lastOpenedMovie: undefined,
  setLastOpenedMovie: (movie: Movie) => set({ lastOpenedMovie: movie }),
  fetchMovies: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'movies'));
      const movieList = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as Movie))
        .sort((a, b) => (b.releaseDate || '').localeCompare(a.releaseDate || '')); // Sort by release date
      set({ movies: movieList, loading: false });
    } catch (error) {
      console.error('Error fetching movies:', error);
      set({ loading: false });
    }
  },
}));

export default function HomeTab() {
  const { movies, loading, lastOpenedMovie, setLastOpenedMovie, fetchMovies } = useMoviesStore();
  const router = useRouter();

  useEffect(() => {
    fetchMovies();
  }, []);

  const categorizedMovies = (category: string) =>
    movies.filter((movie) => movie.categories?.includes(category));

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#FF6A3D" style={styles.loader} />
        <Text style={{ color: '#FFFFFF', textAlign: 'center', marginTop: 20 }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.container}>
        {/* Stream Everywhere Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.highlight}>Stream</Text> Everywhere
          </Text>
          <View style={styles.streamCard}>
            <Image
              source={{ uri: lastOpenedMovie?.bannerUrl || movies[movies.length - 1]?.bannerUrl || '' }}
              style={styles.streamImage}
            />
            <TouchableOpacity
              style={styles.streamButton}
              onPress={() => {
                const movie = lastOpenedMovie || movies[movies.length - 1];
                if (movie) {
                  setLastOpenedMovie(movie);
                  router.push(`/MovieDetail/${movie.id}`);
                }
              }}
            >
              <AntDesign name="play" size={24} color="#FF6A3D" />
              <View>
                <Text style={styles.continueText}>Continue With</Text>
                <Text style={styles.movieTitle}>
                  {lastOpenedMovie?.title || movies[movies.length - 1]?.title || 'Unknown Movie'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Trending Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {movies.slice(0, 20).map((movie: Movie) => (
              <TouchableOpacity
                key={movie.id}
                style={styles.movieCard}
                onPress={() => {
                  setLastOpenedMovie(movie);
                  router.push(`/MovieDetail/${movie.id}`);
                }}
              >
                <Image source={{ uri: movie.posterUrl }} style={styles.movieImage} />
                <View style={styles.titleContainer}>
                  <Text style={styles.movieTitleText}>{movie.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Categories */}
        {['Nollywood', 'Action', 'Kids', 'Comedy'].map((category) => {
          const categoryMovies = categorizedMovies(category);
          if (categoryMovies.length > 0) {
            return (
              <View style={styles.section} key={category}>
                <Text style={styles.sectionTitle}>{category}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {categoryMovies.map((movie: Movie) => (
                    <TouchableOpacity
                      key={movie.id}
                      style={styles.movieCard}
                      onPress={() => {
                        setLastOpenedMovie(movie);
                        router.push(`/MovieDetail/${movie.id}`);
                      }}
                    >
                      <Image source={{ uri: movie.posterUrl }} style={styles.movieImage} />
                      <View style={styles.titleContainer}>
                        <Text style={styles.movieTitleText}>{movie.title}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            );
          }
          return null;
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

// import React, { useEffect } from 'react';
// import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
// import AntDesign from '@expo/vector-icons/AntDesign';
// import { useRouter, Stack } from 'expo-router';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '../../firebase/firebase';
// import { create } from 'zustand';
//
// // Define the movie type
// interface Movie {
//   id: string;
//   title: string;
//   posterUrl: string;
//   bannerUrl?: string; // Added this field
//   synopsis?: string;
//   releaseDate?: string;
//   trailerUrl?: string;
//   downloadUrl?: string;
//   categories?: string[];
// }
//
//
// // Zustand Store with TypeScript
// interface MovieStore {
//   movies: Movie[];
//   loading: boolean;
//   fetchMovies: () => Promise<void>;
// }
//
// const useMoviesStore = create<MovieStore>((set) => ({
//   movies: [],
//   loading: true,
//   fetchMovies: async () => {
//     try {
//       const querySnapshot = await getDocs(collection(db, 'movies'));
//       const movieList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Movie));
//       set({ movies: movieList, loading: false });
//     } catch (error) {
//       console.error('Error fetching movies:', error);
//       set({ loading: false });
//     }
//   },
// }));
//
// export default function HomeTab() {
//   const { movies, loading, fetchMovies } = useMoviesStore();
//   const router = useRouter();
//
//   useEffect(() => {
//     fetchMovies();
//   }, []);
//
//   if (loading) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <ActivityIndicator size="large" color="#FF6A3D" style={styles.loader} />
//         <Text style={{ color: '#FFFFFF', textAlign: 'center', marginTop: 20 }}>Loading...</Text>
//       </SafeAreaView>
//     );
//   }
//
//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <Stack.Screen options={{ headerShown: false }} />
//       <ScrollView style={styles.container}>
//         {/* Stream Everywhere Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>
//             <Text style={styles.highlight}>Stream</Text> Everywhere
//           </Text>
//           <View style={styles.streamCard}>
//             <Image
//               source={{ uri: movies[movies.length - 1]?.bannerUrl || '' }}
//               style={styles.streamImage}
//             />
//             <TouchableOpacity
//               style={styles.streamButton}
//               onPress={() => router.push(`/MovieDetail/${movies[movies.length - 1]?.id}`)}
//             >
//               <AntDesign name="play" size={24} color="#FF6A3D" />
//               <View>
//                 <Text style={styles.continueText}>Continue With</Text>
//                 <Text style={styles.movieTitle}>
//                   {movies[movies.length - 1]?.title || 'Unknown Movie'}
//                 </Text>
//               </View>
//             </TouchableOpacity>
//           </View>
//         </View>
//
//
//         {/* Trending Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Trending</Text>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             {movies.map((movie: Movie) => (
//               <TouchableOpacity
//                 key={movie.id}
//                 style={styles.movieCard}
//                 onPress={() => router.push(`/MovieDetail/${movie.id}`)}
//               >
//                 <Image source={{ uri: movie.posterUrl }} style={styles.movieImage} />
//                 <View style={styles.titleContainer} className='py-2'>
//                   <Text style={styles.movieTitleText} className='font-semibold'>{movie.title}</Text>
//                 </View>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  highlight: {
    color: '#FF6A3D',
  },
  streamCard: {
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  streamImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  streamButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 16,
    bottom: 16,
    borderRadius: 20,
    backdropFilter: 'blur(10px)',
    backgroundColor: '#dadada78',
    height: 50,
    gap: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
  continueText: {
    color: '#BCBCBC',
    fontSize: 12,
  },
  movieTitle: {
    color: '#FFFFFF',
    fontSize: 16,
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
  titleContainer: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 20,
    backgroundColor: '#dadada78',
    borderRadius: 15,
    textAlign: 'center',
  },
  movieTitleText: {
    fontSize: 11,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
