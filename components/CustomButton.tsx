import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import React from 'react';
import { CustomButtonProps } from '@/type';
import cn from 'clsx';

export default function CustomButton({
  isLoading = false,
  leftIcon,
  onPress,
  style,
  textStyle,
  title = 'Click me',
}: CustomButtonProps) {
  return (
    <Pressable className={cn('custom-btn', style)} onPress={onPress} disabled={isLoading}>
      {leftIcon}
      <View className="flex-row self-center">
        {isLoading ? (
          <ActivityIndicator size="small" />
        ) : (
          <Text className={cn('paragraph-semibold text-white-100', textStyle)}>{title}</Text>
        )}
      </View>
    </Pressable>
  );
}
