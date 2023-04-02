import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { Colors, auth } from "../config";
import { signOut } from "firebase/auth";

interface User {
  name: string;
}

export const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    async function fetchData() {
      const uid = auth.currentUser?.uid;
      const userRef = doc(collection(db, "users"), uid!);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        setUser(docSnap.data() as User);
        setName(docSnap.data().name);
      }
    }
    fetchData();
  }, []);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    setEditing(false);
    const uid = auth.currentUser?.uid;
    const userRef = doc(collection(db, "users"), uid!);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      console.log(docSnap.data());
      await setDoc(userRef, { name });
    }
    console.log(name);
  };

  const handleLogout = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={Colors.blue} size={40} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome:</Text>

      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <TouchableOpacity style={styles.button} onPress={handleSave} disabled>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: "100%",
  },
  button: {
    backgroundColor: "#3498db",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});
