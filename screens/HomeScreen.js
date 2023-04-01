import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Button,
  Text,
  ActivityIndicator,
} from "react-native";
import { signOut } from "firebase/auth";
import CountdownTimer from "./CountdownTimer";
import { collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

import { auth, Colors } from "../config";

export const HomeScreen = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [birthDate, setBirthDate] = useState(null);

  const handleLogout = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };

  const convertDate = async (date) => {
    const dateArray = date.split("/");
    const year = dateArray[2];
    const month = dateArray[1];
    const day = dateArray[0];
    return new Date(`${year}-${month}-${day}`);
  };

  //function to get user data from firestore
  const getUserData = async () => {
    const user = auth.currentUser;
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setUserData(docSnap.data());
      const dateOfBirth = docSnap.data().dateOfBirth;
      const convertedDate = await convertDate(dateOfBirth);
      setBirthDate(convertedDate);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }

    setLoading(false);
  };

  const calculateLifeExpectancy = () => {
    let lifeExpectancy = userData.stateLivingAge;

    if (userData.smoke) lifeExpectancy -= 10;
    if (userData.exercises >= 10 && userData.exercises <= 15)
      lifeExpectancy += 3;
    if (userData.exercises >= 16) lifeExpectancy += 6;
    if (userData.exercises < 5) lifeExpectancy -= 5;

    if (userData.gender == "masculino" && userData.isSomer == true)
      lifeExpectancy -= 12;
    if (userData.gender == "feminino" && userData.isSomer == true)
      lifeExpectancy -= 10;

    if (userData.isAlcoholic) lifeExpectancy -= 7.6;

    if (userData.usesDrugs) lifeExpectancy -= 15;

    if (userData.isAnxious || userData.hasDepression) lifeExpectancy -= 15;

    if (userData.isDiabethic) lifeExpectancy -= 20;

    //aqui
    if (userData.hasHypertension) lifeExpectancy -= 16.5;

    if (userData.hasHeartDisease) lifeExpectancy -= 8;

    return lifeExpectancy;
  };

  useEffect(() => {
    getUserData();
  }, []);

  const lifeExpectancy = 75;

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size={42} />
      ) : (
        <CountdownTimer
          birthDate={birthDate}
          lifeExpectancy={calculateLifeExpectancy()}
        />
      )}

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
