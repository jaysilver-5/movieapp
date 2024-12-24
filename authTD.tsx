import React, { useState } from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { Stack } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  updateProfile,
} from "firebase/auth";

const auth = getAuth();
const db = getFirestore();

export default function Auth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Only used for signup
  const [name, setName] = useState(""); // Only used for signup
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (loading) return; // Prevent duplicate submissions
    setLoading(true);

    try {
      if (isLogin) {
        // Login logic
        await signInWithEmailAndPassword(auth, email.trim(), password);
        alert("Login successful!");
        router.replace("(tabs)"); // Redirect to the tabs page
      } else {
        // Signup logic
        if (password !== confirmPassword) {
          alert("Passwords do not match!");
          setLoading(false);
          return;
        }

        // Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const user = userCredential.user;

        if (user) {
          await updateProfile(user, { displayName: name });
          const userData = {
            email: email.trim(),
            displayName: name,
            movie_list: [],
            downloads: [],
          };
          const userRef = doc(db, "users", user.uid); // Use uid as the document ID
          await setDoc(userRef, userData);
        }

        alert("Account created successfully!");
        setIsLogin(true); // Switch to login after successful signup
      }
    } catch (error) {
      console.error("Authentication error: ", error);
      alert(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    if (loading) return; // Prevent duplicate submissions
    setLoading(true);

    try {
      // Sign in anonymously
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;

      // Optionally, save guest user data in Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        displayName: "Guest",
        movie_list: [],
        downloads: [],
      });

      alert("Signed in as Guest!");
      router.replace("(tabs)"); // Redirect to the tabs page
    } catch (error) {
      console.error("Guest sign-in error: ", error);
      alert(error.message || "Failed to sign in as Guest");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1a1a2e" }}>
      {loading && (
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
          }}
        >
          <ActivityIndicator size="large" color="#FF6A3D" />
        </View>
      )}
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "500", marginBottom: 24 }}>
          {isLogin ? "Login" : "Sign Up"}
        </Text>

        {!isLogin && (
          <TextInput
            style={{
              width: "100%",
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
              color: "#fff",
            }}
            placeholder="Name"
            placeholderTextColor="#ccc"
            value={name}
            onChangeText={setName}
          />
        )}

        <TextInput
          style={{
            width: "100%",
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            color: "#fff",
          }}
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={{
            width: "100%",
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            color: "#fff",
          }}
          placeholder="Password"
          placeholderTextColor="#ccc"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {!isLogin && (
          <TextInput
            style={{
              width: "100%",
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
              color: "#fff",
            }}
            placeholder="Confirm Password"
            placeholderTextColor="#ccc"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        )}

        <TouchableOpacity
          style={{
            backgroundColor: "#FF6A3D",
            width: "100%",
            padding: 16,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={handleAuth}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
            {isLogin ? "Login" : "Sign Up"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={{ marginTop: 16 }}>
          <Text style={{ color: "#f88e6e", textDecorationLine: "underline" }}>
            {isLogin ? "Don’t have an account? Sign up" : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            marginTop: 16,
            padding: 16,
            backgroundColor: "#555",
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={handleGuestSignIn}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>Sign in as Guest</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
