import { Text, Pressable, Image, Platform } from 'react-native';
import React from 'react';
import { MenuItem } from '@/type';
import { appwriteConfig } from '@/lib/appwrite';

export default function MenuCard({ item: { image_url, price, name } }: { item: MenuItem }) {
  const imageUrl = `${image_url}?project=${appwriteConfig.projectId}`;
  return (
    <Pressable
      className="menu-card"
      style={Platform.OS === 'android' ? { elevation: 10, shadowColor: '#878787' } : {}}>
      <Image source={{ uri: imageUrl }} className="absolute -top-10 size-32" resizeMode="contain" />
      <Text className="base-bold mb2 text-center text-dark-100" numberOfLines={1}>
        {name}
      </Text>
      <Text className="body-regular mb-4 text-gray-200">From ${price} </Text>
      <Pressable>
        <Text className="paragraph-bold text-primary">Add to Cart +</Text>
      </Pressable>
    </Pressable>
  );
}
