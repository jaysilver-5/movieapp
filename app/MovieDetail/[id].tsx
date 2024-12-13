import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import YoutubePlayer from "react-native-youtube-iframe";
import { useRouter } from 'expo-router';

type Genre = string;

interface RelatedMovie {
  id: string;
  title: string;
  posterUrl: string;
}

interface Movie {
  id: string;
  title: string;
  trailerUrl?: string;
  rating: number;
  releaseDate: string;
  genres: Genre[];
  synopsis: string;
  bannerUrl: string;
  relatedMovies: RelatedMovie[];
}

const dummyMovie: Movie = {
  id: '1',
  title: 'Star Wars: The Last Jedi',
  trailerUrl: 'https://www.youtube.com/watch?v=xOsLIiBStEs', // YouTube link
  rating: 7.0,
  releaseDate: 'December 9, 2017',
  genres: ['Action', 'Sci-Fi'],
  synopsis:
    'Rey (Daisy Ridley) finally manages to find the legendary Jedi knight, Luke Skywalker (Mark Hamill) on an island with a magical aura...',
  bannerUrl:
    'https://upload.wikimedia.org/wikipedia/en/7/7f/Star_Wars_The_Last_Jedi.jpg',
  relatedMovies: [
    {
      id: '2',
      title: 'Star Wars: The Rise of Skywalker',
      posterUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNhbrdJc-8s2R0yvdMoM18LyWFcIkpHfYcyH7Exc4OlN7CLNfLPPvRc0vC087pepetHiE&usqp=CAU',
    },
    {
      id: '3',
      title: 'Star Wars: The Force Awakens',
      posterUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNhbrdJc-8s2R0yvdMoM18LyWFcIkpHfYcyH7Exc4OlN7CLNfLPPvRc0vC087pepetHiE&usqp=CAU',
    },
    {
      id: '4',
      title: 'Rogue One: A Star Wars Story',
      posterUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNhbrdJc-8s2R0yvdMoM18LyWFcIkpHfYcyH7Exc4OlN7CLNfLPPvRc0vC087pepetHiE&usqp=CAU',
    },
  ],
};

const MovieDetail: React.FC = () => {
  const [movie, setMovie] = useState<Movie | null>(dummyMovie);
  const [playing, setPlaying] = useState<boolean>(false);
  const { width } = Dimensions.get('window');
  const router = useRouter();

  const onStateChange = useCallback((state: any) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("Video has finished playing!");
    }
  }, []);

  if (!movie) {
    return (
      <ActivityIndicator
        size="large"
        color="#fff"
        style={{ flex: 1, backgroundColor: '#1C1C2A' }}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.background}>
        {/* Video Area */}
        <View style={styles.mediaContainer}>
          {playing ? (
            <YoutubePlayer
              height={250}
              width={width - 32}
              play={playing}
              videoId={"xOsLIiBStEs"} // Extracted from the trailer URL
              onChangeState={onStateChange}
            />
          ) : (
            <View style={styles.videoOverlayContainer}>
  <Image
    source={{ uri: movie.bannerUrl || movie.relatedMovies[0]?.posterUrl }}
    style={styles.bannerImage}
  />
  <TouchableOpacity
    style={styles.playButtonContainer}
    onPress={() => setPlaying(true)}
  >
    <Ionicons name="play-circle" size={80} color="#FFFFFF" />
  </TouchableOpacity>
</View>

          )}
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{movie.title}</Text>
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Release date:</Text>
          <Text style={styles.value}>{movie.releaseDate}</Text>

          <Text style={styles.label}>Genres:</Text>
          <View style={styles.genreContainer}>
            {movie.genres.map((genre, index) => (
              <Text key={index} style={styles.genre}>
                {genre}
              </Text>
            ))}
          </View>
        </View>

        {/* Synopsis */}
        <View style={styles.synopsisContainer}>
          <Text style={styles.synopsisLabel}>Synopsis</Text>
          <Text style={styles.synopsisText}>{movie.synopsis}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1C1C2A',
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
  background: {
    flex: 1,
    padding: 16,
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
  titleContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
});

export default MovieDetail;
