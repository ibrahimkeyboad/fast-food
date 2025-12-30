import { images } from '@/constants';
import useAuthStore from '@/lib/store/auth.store';
import { Redirect, Slot } from 'expo-router';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  ImageBackground,
  Image,
} from 'react-native';

export default function AuthLayout() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) return <Redirect href="/" />;
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView className="h-full bg-white" keyboardShouldPersistTaps="handled">
        <View
          className="relative w-full"
          style={{ height: Dimensions.get('screen').height / 2.25 }}>
          <ImageBackground
            source={images.loginGraphic}
            className="size-full rounded-b-lg"
            resizeMode="stretch"
          />
          <Image source={images.logo} className="absolute -bottom-16 z-10 size-48 self-center" />
        </View>
        <Slot />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
