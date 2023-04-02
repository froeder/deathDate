import React, { Component } from "react";
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

type HomeScreenProps = {
  navigation: any;
};

type HomeScreenState = {
  userData: any;
  loading: boolean;
  birthDate: Date | null;
};

class HomeScreen extends Component<HomeScreenProps, HomeScreenState> {
  constructor(props: HomeScreenProps) {
    super(props);
    this.state = {
      userData: {},
      loading: true,
      birthDate: null,
    };
  }

  handleLogout = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };

  convertDate = async (date: string) => {
    const dateArray = date.split("/");
    const year = dateArray[2];
    const month = dateArray[1];
    const day = dateArray[0];
    return new Date(`${year}-${month}-${day}`);
  };

  getUserData = async () => {
    const user = auth.currentUser;
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this.setState({ userData: docSnap.data() });
      const dateOfBirth = docSnap.data().dateOfBirth;
      const convertedDate = await this.convertDate(dateOfBirth);
      this.setState({ birthDate: convertedDate });
    } else {
      console.log("No such document!");
    }

    this.setState({ loading: false });
  };

  calculateLifeExpectancy = () => {
    let lifeExpectancy = this.state.userData.stateLivingAge;

    const userData = { ...this.state.userData };

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

    if (userData.hasHypertension) lifeExpectancy -= 16.5;

    if (userData.hasHeartDisease) lifeExpectancy -= 8;
    return lifeExpectancy;
  };

  async componentDidMount() {
    await this.getUserData();
    this.props.navigation.addListener("focus", async () => {
      await this.getUserData();
    });
  }

  componentWillUnmount() {}

  render() {
    return (
      <View style={styles.container}>
        {this.state.loading ? (
          <ActivityIndicator size={42} />
        ) : (
          <CountdownTimer
            birthDate={this.state.birthDate}
            lifeExpectancy={this.calculateLifeExpectancy()}
          />
        )}

        <Button title="Sair" onPress={this.handleLogout} />
      </View>
    );
  }
}

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

export default HomeScreen;
