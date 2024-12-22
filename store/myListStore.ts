import create from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MyListState {
  myList: string[];
  toggleMovie: (id: string) => void;
  loadList: () => Promise<void>;
}

export const useMyListStore = create<MyListState>((set, get) => ({
  myList: [],
  toggleMovie: async (id) => {
    const { myList } = get();
    const updatedList = myList.includes(id)
      ? myList.filter((movieId) => movieId !== id)
      : [...myList, id];

    await AsyncStorage.setItem('myList', JSON.stringify(updatedList));
    set({ myList: updatedList });
  },
  loadList: async () => {
    const storedList = await AsyncStorage.getItem('myList');
    set({ myList: storedList ? JSON.parse(storedList) : [] });
  },
}));
