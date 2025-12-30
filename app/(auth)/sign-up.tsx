import { View, Text, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';
import { useState } from 'react';
import { createUser } from '@/lib/appwrite';

export default function SignUp() {
  const [isSubmitting, setisSubmitting] = useState(false);
  const [form, setForm] = useState({ email: '', name: '', password: '' });

  async function submit() {
    const { email, name, password } = form;
    if (!name || !email || !password) return;

    setisSubmitting(true);

    try {
      await createUser({ email, password, name });
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
        placeholder="Enter your name"
        value={form.name}
        onChangeText={(text) => {
          setForm({ ...form, name: text });
        }}
        label="Name"
      />
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
      <CustomButton title="Sign Up" isLoading={isSubmitting} onPress={submit} />

      <View className="mt-5 flex-row justify-center gap-2">
        <Text className="base-regular text-gray-100">Already have an account?</Text>
        <Link href="/(auth)/sign-up" className="base-bold text-primary">
          Sign In
        </Link>
      </View>
    </View>
  );
}
