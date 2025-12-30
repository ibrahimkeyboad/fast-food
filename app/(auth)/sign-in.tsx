import { View, Text, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';
import { useState } from 'react';
import { signIn } from '@/lib/appwrite';

export default function SignIn() {
  const [isSubmitting, setisSubmitting] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  async function submit() {
    const { email, password } = form;
    if (!email || !password) return Alert.alert('Error', 'Please fill in all fields');

    setisSubmitting(true);

    try {
      await signIn({ email, password });

      Alert.alert('Success', 'Signed in successfully');
      router.replace('/');
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    } finally {
      setisSubmitting(false);
    }
  }

  return (
    <View className="mt-5 gap-10 rounded-lg bg-white-100 p-5">
      <CustomInput
        placeholder="Enter your email"
        value={form.email}
        onChangeText={(text) => {
          setForm({ ...form, email: text });
        }}
        label="Email"
        keyboardType="email-address"
      />
      <CustomInput
        placeholder="Enter your password"
        value={form.password}
        onChangeText={(text) => {
          setForm({ ...form, password: text });
        }}
        label="Password"
        secureTextEntry={true}
      />
      <CustomButton title="Sign In" isLoading={isSubmitting} onPress={submit} />

      <View className="mt-5 flex-row justify-center gap-2">
        <Text className="base-regular text-gray-100">Don&#39;t have an account?</Text>
        <Link href="/(auth)/sign-up" className="base-bold text-primary">
          Sign Up
        </Link>
      </View>
    </View>
  );
}
