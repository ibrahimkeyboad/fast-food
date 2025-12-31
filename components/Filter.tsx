import { Text, FlatList, TouchableOpacity, Platform } from 'react-native';
import { useMemo, useRef, useEffect } from 'react'; // Added useRef and useEffect
import { router, useLocalSearchParams } from 'expo-router';
import { Category } from '@/type';
import cn from 'clsx';

export default function Filter({ categories }: { categories: Category[] }) {
  const { category: activeCategory } = useLocalSearchParams<{ category: string }>();

  // 1. Create a reference to the FlatList
  const flatListRef = useRef<FlatList>(null);

  const filterData = useMemo(() => {
    const base = [{ $id: 'all', name: 'All' }];
    return categories ? [...base, ...categories] : base;
  }, [categories]);

  // 2. Automatically scroll when activeCategory changes
  useEffect(() => {
    const activeId = activeCategory || 'all';
    const index = filterData.findIndex((item) => item.$id === activeId);

    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5, // 0.5 centers the item, 0 is left, 1 is right
      });
    }
  }, [activeCategory, filterData]);

  function handlePress(id: string) {
    router.setParams({ category: id === 'all' ? '' : id });
  }

  return (
    <FlatList
      ref={flatListRef} // 3. Attach the ref
      data={filterData}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-x-2 pb-3"
      keyExtractor={(item) => item.$id}
      // 4. Optimization: helps FlatList calculate positions accurately
      onScrollToIndexFailed={(info) => {
        flatListRef.current?.scrollToOffset({
          offset: info.averageItemLength * info.index,
          animated: true,
        });
      }}
      renderItem={({ item }) => {
        const isActive = (activeCategory || 'all') === item.$id;
        return (
          <TouchableOpacity
            className={cn('filter', isActive ? 'bg-amber-500' : 'bg-white')}
            style={Platform.OS === 'android' ? { elevation: 5, shadowColor: '#878787' } : {}}
            onPress={() => handlePress(item.$id)}>
            <Text className={cn('body-medium', isActive ? 'text-white' : 'text-gray-200')}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}
