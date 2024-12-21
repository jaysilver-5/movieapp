import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
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
  const [loading, setLoading] = useState<boolean>(true);
  const [playing, setPlaying] = useState<boolean>(false);
  const { width } = Dimensions.get('window');
  const router = useRouter();
  const { movieId } = useLocalSearchParams();

  // Fetch movie details from Firestore
  const fetchMovie = async (id: string) => {
    try {
      const docRef = doc(db, 'movies', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setMovie({ id: docSnap.id, ...docSnap.data() } as Movie);
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


  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const docRef = doc(db, 'movies', id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setMovie({ id: docSnap.id, ...docSnap.data() } as Movie);
        } else {
          console.log('Movie not found');
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);


  // Handle YouTube state changes
  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('Video has finished playing!');
    }
  }, []);

  // Extract YouTube video ID from the trailer URL
  const extractVideoId = (url?: string) => {
    if (!url) return '';
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return match ? match[1] : '';
  };

  // Loading state
  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#FF6A3D"
        style={styles.loader}
      />
    );
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
      {/* Header with Back Button */}
      <TouchableOpacity style={styles.header} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Media Section: Trailer or Banner Image */}
      <View style={styles.mediaContainer}>
        {playing ? (
          <YoutubePlayer
            height={250}
            width={width - 32}
            play={playing}
            videoId={extractVideoId(movie.trailerUrl)}
            onChangeState={onStateChange}
          />
        ) : (
          <View style={styles.videoOverlayContainer}>
            <Image source={{ uri: movie.bannerUrl }} style={styles.bannerImage} />
            <TouchableOpacity style={styles.playButtonContainer} onPress={() => setPlaying(true)}>
              <Ionicons name="play-circle" size={80} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Title */}
      <Text style={styles.title}>{movie.title}</Text>

      {/* Info Section */}
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

      {/* Synopsis Section */}
      <View style={styles.synopsisContainer}>
        <Text style={styles.synopsisLabel}>Synopsis</Text>
        <Text style={styles.synopsisText}>{movie.synopsis}</Text>
      </View>

      {/* Episodes Section for Series */}
      {movie.series && movie.episodes && (
        <View style={styles.episodesContainer}>
          <Text style={styles.episodesLabel}>Episodes</Text>
          {movie.episodes.map((episode, index) => (
            <View key={index} style={styles.episodeCard}>
              <Text style={styles.episodeTitle}>
                S{episode.season} E{episode.episode}: {episode.title}
              </Text>
              <TouchableOpacity onPress={() => Alert.alert('Download', 'Download functionality not implemented.')}>
                <Text style={styles.downloadLink}>Download</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  downloadLink: {
    color: '#FF6A3D',
    marginTop: 4,
  },
});

export default MovieDetail;
