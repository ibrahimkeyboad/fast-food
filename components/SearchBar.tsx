import { View, TextInput, Pressable, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { images } from '@/constants';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchBar() {
  const { query } = useLocalSearchParams<{ query: string }>();
  const [search, setSearch] = useState(query || '');

  const debouncedQuery = useDebouncedCallback((text) => router.setParams({ query: text }), 500);

  function handleSearchChange(text: string) {
    setSearch(text);
    debouncedQuery(text);
  }

  // useEffect(() => {
  //   setSearch(query || '');
  // }, [query]);

  return (
    <View className="searchbar">
      <TextInput
        className="flex-1 p-5"
        placeholder="Search..."
        value={search}
        placeholderTextColor="#a0a0a0"
        onChangeText={handleSearchChange}
        returnKeyType="search"
      />
      <Pressable className=" pr-5" onPress={() => {}}>
        <Image source={images.search} className="size-6" resizeMode="contain" tintColor="#5d5f6d" />
      </Pressable>
    </View>
  );
}
