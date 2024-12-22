import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1C1C2A',
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
//     display:'flex',
//     flexDirection: 'row',
//     justifyContent: 'center',
    width: '100%'
  },
  date:{
      width: 96,
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
  },
    myListButton: {
      backgroundColor: '#FF6A3D',
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      display: 'flex',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5, // For Android shadow
      alignItems: 'center',
      flexDirection: 'row',
      gap: 2
    },
    myListButtonActive: {
      backgroundColor: '#4CAF50', // Green for active state
    },
    myListButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'row'
    },
});

export default styles;
