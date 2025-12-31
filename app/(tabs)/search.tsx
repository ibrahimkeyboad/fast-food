import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAppwrite from '@/lib/useAppwrite';
import { getCategories, getMenu } from '@/lib/appwrite';
import { useLocalSearchParams } from 'expo-router';
import CartButton from '@/components/CartButton';
import cn from 'clsx';
import MenuCard from '@/components/MenuCard';
import { MenuItem } from '@/type';
import SearchBar from '@/components/SearchBar';
import Filter from '@/components/Filter';

const HeadeComponent = ({ categories }) => (
  <View className="my-5 gap-5">
    <View className="w-full flex-row justify-between">
      <View className="self-start">
        <Text className="small-bold uppercase text-primary">Search </Text>
        <View className="mt-0.5 gap-x-1">
          <Text className="paragraph-semibold text-dark-100">Find your favorite food</Text>
        </View>
      </View>
      <CartButton />
    </View>
    <SearchBar />
    <Filter categories={categories!} />
  </View>
);

export default function Search() {
  const { category, query } = useLocalSearchParams<{ query: string; category: string }>();

  const { data, refetch, loading } = useAppwrite({
    fn: getMenu,
    params: {
      category,
      query,
      limit: 6,
    },
  });

  const { data: categories } = useAppwrite({ fn: getCategories });

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={data}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        columnWrapperClassName="gap-7"
        contentContainerClassName="gap-7 px-5 pb-32"
        ListHeaderComponent={<HeadeComponent categories={categories} />}
        renderItem={({ item, index }) => {
          const isEven = index % 2 === 0;

          return (
            <View className={cn('max-w-[48%] flex-1', !isEven ? 'mt-10' : 'mt-0')}>
              <MenuCard item={item as unknown as MenuItem} />
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
