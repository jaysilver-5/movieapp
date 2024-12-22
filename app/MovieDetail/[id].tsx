import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Alert,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

// Define types
interface Episode {
  season: string;
  episode: string;
  title: string;
  downloadLink: string;
}

interface Movie {
  id: string;
  title: string;
  trailerUrl?: string;
  downloadUrl?: string;
  posterUrl: string;
  bannerUrl: string;
  synopsis: string;
  releaseDate: string;
  categories: string[];
  series: boolean;
  episodes?: Episode[];
}

const MovieDetail: React.FC = () => {
  const { id } = useLocalSearchParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [playing, setPlaying] = useState<boolean>(false);
  const { width } = Dimensions.get('window');
  const router = useRouter();

  // Fetch movie details
  const fetchMovie = async (id: string) => {
    try {
      const docRef = doc(db, 'movies', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const fetchedMovie = { id: docSnap.id, ...docSnap.data() } as Movie;
        setMovie(fetchedMovie);

        // Fetch related movies
        fetchRelatedMovies(fetchedMovie.categories);
      } else {
        Alert.alert('Movie not found');
        router.back();
      }
    } catch (error) {
      console.error('Error fetching movie:', error);
      Alert.alert('Error fetching movie details');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedMovies = async (categories: string[]) => {
    try {
      const moviesRef = collection(db, 'movies');
      const q = query(moviesRef, where('categories', 'array-contains-any', categories));
      const querySnapshot = await getDocs(q);

      const related = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as Movie))
        .filter((m) => m.id !== id); // Exclude the current movie

      setRelatedMovies(related);
    } catch (error) {
      console.error('Error fetching related movies:', error);
    }
  };

  useEffect(() => {
    if (id) fetchMovie(id as string);
  }, [id]);

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('Video has finished playing!');
    }
  }, []);

  const extractVideoId = (url?: string) => {
    if (!url) return '';
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return match ? match[1] : '';
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#FF6A3D" style={styles.loader} />;
  }

  if (!movie) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#fff' }}>Movie details not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.header} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.mediaContainer}>
        {playing ? (
            <View style={styles.youtubeplay}>
              <YoutubePlayer
                height={250}
                width={width - 32}
                play={playing}
                videoId={extractVideoId(movie.trailerUrl)}
                onChangeState={onStateChange}
              />
            </View>
        ) : (
          <View style={styles.videoOverlayContainer}>
            <Image source={{ uri: movie.bannerUrl }} style={styles.bannerImage} />
            <TouchableOpacity style={styles.playButtonContainer} onPress={() => setPlaying(true)}>
              <Ionicons name="play-circle" size={80} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={styles.title}>{movie.title}</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Release Date:</Text>
        <Text style={styles.value}>{movie.releaseDate}</Text>

        <Text style={styles.label}>Genres:</Text>
        <View style={styles.genreContainer}>
          {movie.categories.map((genre, index) => (
            <Text key={index} style={styles.genre}>
              {genre}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.synopsisContainer}>
        <Text style={styles.synopsisLabel}>Synopsis</Text>
        <Text style={styles.synopsisText}>{movie.synopsis}</Text>
      </View>

      {movie.series && movie.episodes ? (
        <View style={styles.episodesContainer}>
          <Text style={styles.episodesLabel}>Episodes</Text>
          {movie.episodes.map((episode, index) => (
            <View key={index} style={styles.episodeCard}>
              <Text style={styles.episodeTitle}>
                S{episode.season} E{episode.episode}: {episode.title}
              </Text>
              <TouchableOpacity style={styles.downloadButton} onPress={() => Alert.alert('Download', 'Download link pressed!')}>
                <Text style={styles.downloadButtonText}>Download</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : (
        movie.downloadUrl && (
          <TouchableOpacity style={styles.downloadButton} onPress={() => Alert.alert('Download', 'Download link pressed!')}>
            <Text style={styles.downloadButtonText}>Download Movie</Text>
          </TouchableOpacity>
        )
      )}

      <View style={styles.relatedMoviesContainer}>
        <Text style={styles.relatedMoviesLabel}>Related Movies</Text>
        <FlatList
          data={relatedMovies}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.relatedMovieCard}
              onPress={() => router.push(`/movies/${item.id}`)}
            >
              <Image source={{ uri: item.posterUrl }} style={styles.relatedMovieImage} />
              <Text style={styles.relatedMovieTitle}>{item.title}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
      safeArea: {
          flex: 1,
          backgroundColor: '#1C1C2A', // Ensure the safe area background is white
      },
      loader: {
        flex: 1,
        backgroundColor: '#1C1C2A',
        justifyContent: 'center',
      },
      container: {
        flexGrow: 1,
        backgroundColor: '#1C1C2A',
        padding: 16,
      },
      header: {
        position: 'absolute',
        top: 40,
        left: 16,
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 8,
        borderRadius: 50,
      },
      mediaContainer: {
        width: '100%',
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
      },
      videoOverlayContainer: {
        position: 'relative',
        width: '100%',
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
      },
      bannerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 8,
      },
      playButtonContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: 16,
      },
      infoContainer: {
        marginTop: 16,
        padding: 16,
        borderRadius: 10,
        backgroundColor: '#2C2C3A',
      },
      label: {
        color: '#AAAAAA',
        fontSize: 14,
      },
      value: {
        color: '#FFFFFF',
        fontSize: 16,
        marginBottom: 8,
      },
      genreContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
      genre: {
        backgroundColor: '#40405A',
        color: '#FFFFFF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 8,
        borderRadius: 8,
        marginTop: 4,
      },
      synopsisContainer: {
        marginTop: 16,
      },
      synopsisLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
      },
      synopsisText: {
        color: '#CCCCCC',
        marginTop: 8,
      },
      episodesContainer: {
        marginTop: 16,
      },
      episodesLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
      },
      episodeCard: {
        backgroundColor: '#2C2C3A',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
      },
      episodeTitle: {
        color: '#FFFFFF',
        fontSize: 16,
      },
  relatedMoviesContainer: {
    marginTop: 16,
  },
  relatedMoviesLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  relatedMovieCard: {
    width: 120,
    marginRight: 8,
  },
  relatedMovieImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  relatedMovieTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  downloadButton: {
    marginTop: 16,
    backgroundColor: '#FF6A3D',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  youtubeplay: {
      marginTop: 32,
      }
});

export default MovieDetail;
