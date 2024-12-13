
import React, { useState } from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { Stack } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

const auth = getAuth();
const db = getFirestore();

const avatars = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=2",
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=4",
  "https://i.pravatar.cc/150?img=5",
];

export default function Auth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Only used for signup
  const [name, setName] = useState(""); // Only used for signup
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]); // Default avatar
  const [modalVisible, setModalVisible] = useState(false); // Modal state
  const [loading, setLoading] = useState(false);
  const [color] = useState("#FF6A3D");
  const [avatarIndex, setAvatarIndex] = useState(0);
  // const handleAuth = async () => {
  //   if (loading) return; // Prevent duplicate submissions
  //   setLoading(true);
  //   try {
  //     if (isLogin) {
  //       // Login logic
  //       await signInWithEmailAndPassword(auth, email.trim(), password);
  //       alert("Login successful!");
  //       router.replace("(tabs)"); // Redirect to the tabs page
  //     } else {
  //       // Signup logic
  //       if (password !== confirmPassword) {
  //         alert("Passwords do not match!");
  //         return;
  //       }

  //       const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  //       const user = userCredential.user;

  //       if (user) {
  //         await updateProfile(user, {
  //           displayName: name,
  //           photoURL: selectedAvatar,
  //         });
  //       }

  //       alert("Account created successfully!");
  //       setIsLogin(true); // Switch to login after successful signup
  //     }
  //   } catch (error: any) {
  //     alert(error.message || "Authentication failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
          await updateProfile(user, {
            displayName: name,
            photoURL: selectedAvatar,
          });
  
          // Firestore user creation
          const userData = {
            email: email.trim(),
            avatars: avatarIndex,
            displayName: name,
            movie_list: [],
            downloads: [],
          };
  
          const userRef = doc(db, "users", user.uid); // Use uid as the document ID
          await setDoc(userRef, userData);
  
          console.log("User data successfully posted to Firestore");
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
          <>
            {/* Profile Avatar */}
            <View style={{ marginBottom: 24, alignItems: "center" }}>
              <Image
                source={{ uri: selectedAvatar }}
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  borderWidth: 4,
                  borderColor: "#FF6A3D",
                }}
              />
              <TouchableOpacity
                style={{
                  marginTop: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderColor: "#FF6A3D",
                  borderWidth: 1,
                  borderRadius: 8,
                }}
                onPress={() => setModalVisible(true)}
              >
                <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>
                  Choose Avatar
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Form Inputs */}
        {!isLogin && (
          <TextInput
            style={{
              width: "100%",
              backgroundColor: "rgba(255,255,255,0.1)",
              borderColor: "#555",
              color: "#fff",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
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
            borderColor: "#555",
            color: "#fff",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
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
            borderColor: "#555",
            color: "#fff",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
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
              borderColor: "#555",
              color: "#fff",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
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
          disabled={loading}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
            {isLogin ? "Login" : "Sign Up"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={{ marginTop: 16 }}>
          <Text style={{ color: "#f88e6e", textDecorationLine: "underline", textAlign: "center" }}>
            {isLogin ? "Don’t have an account? Sign up" : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>

        {/* Avatar Selection Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            }}
          >
            <View style={{ backgroundColor: "#21213a", width: "80%", padding: 24, borderRadius: 8 }}>
              <Text
                style={{ fontSize: 18, color: "#fff", fontWeight: "bold", textAlign: "center" }}
              >
                Choose an Avatar
              </Text>
              <ScrollView horizontal style={{ flexDirection: "row", marginVertical: 16 }}>
                {avatars.map((avatar, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setSelectedAvatar(avatar);
                      setAvatarIndex(index)
                      console.log(avatarIndex)
                      setModalVisible(false);
                    }}
                    style={{ marginHorizontal: 8 }}
                  >
                    <Image
                      source={{ uri: avatar }}
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 32,
                        borderWidth: 2,
                        borderColor: avatar === selectedAvatar ? "#FF6A3D" : "transparent",
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={{
                  backgroundColor: "#FF6A3D",
                  padding: 12,
                  borderRadius: 8,
                  alignSelf: "center",
                }}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
