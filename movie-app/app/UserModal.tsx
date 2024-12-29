import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface UserModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ visible, message, onClose }) => {
  if (!visible) return null;

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.messageText}>{message}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 100,
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#21213a",
    padding: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  messageText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#ff0cfe",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "50%",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default UserModal;
