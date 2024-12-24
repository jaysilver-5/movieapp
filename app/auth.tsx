import React, { useState } from "react";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { Stack } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInAnonymously,
} from "firebase/auth";
import { useUserStore } from "../store/store";
import UserModal from "./UserModal";

const auth = getAuth();
const db = getFirestore();

const avatars = [
  "https://img.freepik.com/free-vector/mysterious-gangster-character_23-2148466806.jpg?t=st=1734967901~exp=1734971501~hmac=1c4d01c24b3d428582e2ea36b880f36e96fb10185694bcf98023c73a9540a0f2&w=740",
  "https://img.freepik.com/free-vector/young-prince-vector-illustration_1308-174367.jpg?t=st=1734967845~exp=1734971445~hmac=4c1561e39a0f97068b107849e55de6f499fc6823b4a23a0ea63ad3f22032eb6d&w=360",
  "https://img.freepik.com/free-photo/portrait-beautiful-young-business-woman-eyeglasses_1142-42798.jpg?t=st=1734967558~exp=1734971158~hmac=51417622de5b01959403c491e4b2b084008e0ab4f129e8b86620dcb31b1f9ece&w=740",
  "https://img.freepik.com/free-vector/young-prince-vector-illustration_1308-174367.jpg?t=st=1734967845~exp=1734971445~hmac=4c1561e39a0f97068b107849e55de6f499fc6823b4a23a0ea63ad3f22032eb6d&w=360",
  "https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100279.jpg?t=st=1734967978~exp=1734971578~hmac=191e86b7baedd3223a2a95d6d4b3d4fa05c1b19123c131b0df8bd2fe9502eedb&w=740",
  "https://img.freepik.com/free-photo/ai-generated-concept-human_23-2150688375.jpg?t=st=1734968103~exp=1734971703~hmac=b3c53f6c3dec6b657d50c4ab8d592fe8479654e65729fb91b435940d679379d7&w=360",
  "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436200.jpg?t=st=1734968173~exp=1734971773~hmac=322a0e5498acc51c844cbe3cc1fd5397725a41061c96ea7eaf274f91a1bc7342&w=740",
];

export default function Auth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Only used for signup
  const [name, setName] = useState(""); // Only used for signup
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // Modal state
  const [authModalVisible, setAuthModalVisible] = useState<boolean>(false); // Renamed to avoid conflict
  const [authModalMessage, setAuthModalMessage] = useState<string>(""); // State for auth-related messages
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [avatarIndex, setAvatarIndex] = useState(0);

//   const handleAuth = async () => {
//     if (loading) return;
//     setLoading(true);
//
//     try {
//       if (isLogin) {
//         // Login logic
//         const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
//         const user = userCredential.user;
//
//         if (user) {
//           // Fetch user data from Firestore
//           const userRef = doc(db, "users", user.uid);
//           const userSnapshot = await getDoc(userRef);
//
//           if (userSnapshot.exists()) {
//             const userData = userSnapshot.data();
//
//             // Save user data to Zustand
//             useUserStore.setState({ user: userData });
//
//             alert("Login successful!");
//             router.replace("(tabs)"); // Redirect to tabs page
//           } else {
//             throw new Error("User data not found in Firestore.");
//           }
//         }
//       } else {
//         // Signup logic
//         if (password !== confirmPassword) {
//           alert("Passwords do not match!");
//           setLoading(false);
//           return;
//         }
//
//         const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
//         const user = userCredential.user;
//
//         if (user) {
//           await updateProfile(user, {
//             displayName: name,
//             photoURL: selectedAvatar,
//           });
//
//           const userData = {
//             email: email.trim(),
//             avatarIndex: avatars.indexOf(selectedAvatar),
//             displayName: name,
//             movie_list: [],
//             downloads: [],
//           };
//
//           // Save user data to Firestore
//           const userRef = doc(db, "users", user.uid);
//           await setDoc(userRef, userData);
//
//           // Save user data to Zustand
//           useUserStore.setState({ user: userData });
//
//           alert("Account created successfully!");
//           setIsLogin(true); // Switch to login after signup
//         }
//       }
//     } catch (error) {
//       console.error("Authentication error:", error);
//       alert(error.message || "Authentication failed");
//     } finally {
//       setLoading(false);
//     }
//   };

const handleAuth = async () => {
  if (loading) return;
  setLoading(true);

  try {
    if (isLogin) {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          useUserStore.setState({ user: userData });
          router.replace("(tabs)");
        } else {
          throw new Error("User data not found in Firestore.");
        }
      }
    } else {
      if (password !== confirmPassword) {
        setAuthModalMessage("Passwords do not match!");
        setAuthModalVisible(true);
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      if (user) {
        await updateProfile(user, { displayName: name, photoURL: selectedAvatar });
        const userData = { email: email.trim(), avatarIndex, displayName: name, movie_list: [], downloads: [] };
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, userData);
        useUserStore.setState({ user: userData });
        setIsLogin(true); // Switch to login
      }
    }
  } catch (error: any) {
    setAuthModalMessage(error.message || "Authentication failed");
    setAuthModalVisible(true);
  } finally {
    setLoading(false);
  }
};


//   const handleGuestSignIn = async () => {
//     if (loading) return;
//     setLoading(true);
//
//     try {
//       const userCredential = await signInAnonymously(auth);
//       const user = userCredential.user;
//
//       if (user) {
//         const userData = {
//           displayName: "user@1234",
//           avatarIndex: 1,
//           movie_list: [],
//           downloads: [],
//         };
//
//         // Save guest user data to Firestore
//         const userRef = doc(db, "users", user.uid);
//         await setDoc(userRef, userData);
//
//         // Save guest user data to Zustand
//         useUserStore.setState({ user: userData });
//
//         alert("Signed in as Guest!");
//         router.replace("(tabs)");
//       }
//     } catch (error) {
//       console.error("Guest sign-in error:", error);
//       alert(error.message || "Failed to sign in as Guest");
//     } finally {
//       setLoading(false);
//     }
//   };


    const handleGuestSignIn = async () => {
      if (loading) return;
      setLoading(true);

      try {
        const userCredential = await signInAnonymously(auth);
        const user = userCredential.user;

        if (user) {
          const userData = { displayName: "user@1234", avatarIndex: 1, movie_list: [], downloads: [] };
          const userRef = doc(db, "users", user.uid);
          await setDoc(userRef, userData);
          useUserStore.setState({ user: userData });
          router.replace("(tabs)");
        }
      } catch (error: any) {
        setAuthModalMessage(error.message || "Failed to sign in as Guest");
        setAuthModalVisible(true);
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
      {/* UI Content */}
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


        {/* Form Fields */}
        {!isLogin && (
          <TextInput
            style={{
              width: "100%",
              backgroundColor: "rgba(255,255,255,0.1)",
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
            color: "#fff",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
          }}
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={{
            width: "100%",
            backgroundColor: "rgba(255,255,255,0.1)",
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
        {/* Buttons */}
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
          <Text style={{ color: "#fff", fontSize: 16 }}>Sign In as Guest</Text>
        </TouchableOpacity>

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

      <UserModal
        visible={authModalVisible}
        message={authModalMessage}
        onClose={() => setAuthModalVisible(false)}
      />

    </SafeAreaView>
  );
}
