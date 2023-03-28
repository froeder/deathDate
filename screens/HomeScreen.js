import React, { useState, useEffect } from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import { signOut } from "firebase/auth";
import CountdownTimer from "./CountdownTimer";

import { auth, Colors } from "../config";

export const HomeScreen = () => {
  const handleLogout = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };

  const birthDate = new Date("1994-05-23");
  const lifeExpectancy = 75;

  return (
    <View style={styles.container}>
      <CountdownTimer birthDate={birthDate} lifeExpectancy={lifeExpectancy} />
      <Button title="Sair" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.blue,
  },
  timer: {
    fontSize: 38,
    textAlign: "center",
    marginBottom: 20,
    color: Colors.orange,
  },
  info: {
    fontSize: 16,
    color: "gray",
  },
});
