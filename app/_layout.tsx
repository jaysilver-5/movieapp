import '../global.css';
import React, { useState, useEffect } from "react";
import { Animated, StyleSheet, View, Image, Text } from "react-native";
import { useRouter, useRootNavigationState, Stack } from "expo-router";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export default function RootLayout() {
  const router = useRouter();
  const navigationState = useRootNavigationState(); // Check if the root layout is ready
  const [user, setUser] = useState<User | null>(null);
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  const slideAnim = new Animated.Value(300); // Slide animation starts from bottom
  const scaleAnim = new Animated.Value(1); // Initial scale for pulsating

  useEffect(() => {
    // Monitor Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Animate splash screen
    Animated.sequence([
      // Slide in
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      // Pulsate
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 3 }
      ),
      // Slide out
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsSplashVisible(false);
    });

    return unsubscribe; // Cleanup listener on unmount
  }, []);

  useEffect(() => {
    // Ensure navigation only happens after root layout is ready
    if (!isSplashVisible && navigationState?.key) {
      if (user) {
        router.replace("(tabs)"); // Navigate to tabs view if authenticated
      } else {
        router.replace("/auth"); // Redirect to auth page if not authenticated
      }
    }
  }, [isSplashVisible, user, navigationState?.key]);

  // Splash screen while `isSplashVisible` is true
  if (isSplashVisible) {
    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.content,
            {
              transform: [
                { translateY: slideAnim }, // Slide animation
                { scale: scaleAnim }, // Pulsate animation
              ],
            },
          ]}
        >
          <Image
            source={require("../assets/logo.png")} // Replace with your splash screen logo
            style={styles.logo}
          />
          <Text style={styles.text}>...your movie collection.</Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false, // Disable header for all screens in this Stack
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 24,
    marginBottom: 20,
  },
  logo: {
    width: 235,
    height: 305,
  },
});
