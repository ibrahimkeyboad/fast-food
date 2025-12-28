import { View, Text, FlatList, Pressable, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images, offers } from '@/constants';
import cn from 'clsx';
import CartButton from '@/components/CartButton';

export default function index() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={offers}
        renderItem={({ item, index }) => {
          const isEven = index % 2 === 0;

          return (
            <View>
              <Pressable
                className={cn('offer-card', isEven ? 'flex-row-reverse' : 'flex-row')}
                style={{ backgroundColor: item.color }}
                android_ripple={{ color: '#ffffff22' }}>
                {({ pressed }) => (
                  <>
                    <View className="h-full w-1/2">
                      <Image source={item.image} className="size-full" resizeMode="contain" />
                    </View>
                    <View className={cn('offer-card__info', isEven ? 'pl-10' : 'pr-10')}>
                      <Text className="h1-bold leading-tight text-white">{item.title}</Text>
                      <Image source={images.arrowRight} className="size-10" resizeMode="contain" />
                    </View>
                  </>
                )}
              </Pressable>
            </View>
          );
        }}
        contentContainerClassName="pb-28 px-5"
        ListHeaderComponent={() => (
          <View className="my-5 w-full flex-row justify-between">
            <View className="">
              <Text className=" small-bold text-primary">DELIVER TO</Text>
              <TouchableOpacity className="mt-0.5 flex-row items-center gap-x-1">
                <Text className="paragraph-bold text-dark-100 ">Tanzania</Text>
                <Image source={images.arrowDown} className="size-3" resizeMode="contain" />
              </TouchableOpacity>
            </View>

            <CartButton />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
