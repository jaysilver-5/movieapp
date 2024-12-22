import { StyleSheet } from 'react-native';

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
  signOutButton: {
    width: 100,
    height: 40,
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF6A3D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutText: { color: 'white', fontSize: 15, fontWeight: 'bold' },
});