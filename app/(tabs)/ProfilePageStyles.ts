import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  pageContainer: {
    flexGrow: 1,
    backgroundColor: '#f4f4f8',
    paddingVertical: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profileUsername: {
    fontSize: 16,
    color: '#888',
  },
  sectionContainer: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#444',
  },
  itemCard: {
    marginRight: 12,
    alignItems: 'center',
    width: 120,
  },
  itemImage: {
    width: 120,
    height: 160,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  itemTitle: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default styles;
