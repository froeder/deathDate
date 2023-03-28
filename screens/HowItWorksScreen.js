import React, { useState } from "react";
import { Text, StyleSheet } from "react-native";
import { Formik } from "formik";
import { signInWithEmailAndPassword } from "firebase/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { View, TextInput, Logo, Button, FormErrorMessage } from "../components";
import { Images, Colors, auth } from "../config";
import { useTogglePasswordVisibility } from "../hooks";
import { loginValidationSchema } from "../utils";
import { ScrollView } from "react-native-gesture-handler";

export const HowItWorksScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState("");
  const { passwordVisibility, handlePasswordVisibility, rightIcon } =
    useTogglePasswordVisibility();

  const handleLogin = (values) => {
    const { email, password } = values;
    signInWithEmailAndPassword(auth, email, password).catch((error) =>
      setErrorState(error.message)
    );
  };
  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.logoContainer}>
            <Logo uri={Images.caixao} />
            <Text style={styles.screenTitle}>
              Quer saber quanto tempo ainda lhe resta?
            </Text>
          </View>
          <Text style={styles.footerText}>
            Com o Death Date você pode saber quanto tempo ainda lhe resta de
            vida, basta preencher os campos, aguardar pelos resultados e curtir
            o resto de vida que ainda lhe resta.
          </Text>
          <Text style={styles.footerText}>
            Os cálculos são baseados em estudos científicos e não são 100%
            confiáveis. Baseados em estatísticas, a média de vida de um
            brasileiro é de 75 anos, mas isso não quer dizer que você vai morrer
            com 75 anos, pode ser que você viva mais ou menos que isso.
          </Text>
          <Text style={styles.footerText}>
            E se você quiser saber quanto tempo ainda lhe resta, você pode usar
            o Death Date para isso, e pode decidir fazer ou não as coisas que
            você quer fazer, como viajar, se casar, ter filhos, plantar uma
            árvore, escrever um livro e etc. E muito mais coisas que você ainda
            não pensou em fazer.
          </Text>
          <Text style={styles.footerText}>
            E além disso, após receber os resultados, você pode compartilhar com
            seus amigos e familiares para que eles também saibam quanto tempo
            ainda lhe resta de vida. Você pode também sincronizar os resultados
            seu com o de seus amigos ou família para que vocês possam ver quanto
            tempo ainda lhe resta de vida juntos.
          </Text>
          <Text style={styles.footerText}>
            A melhor parte é que baseado no seu resultado, te damos dicas de
            como aumentar a sua expectativa de vida, como por exemplo, se você
            fuma, você pode parar de fumar, se você bebe, você pode parar de
            beber, se você come muito, você pode comer menos, se você não faz
            exercícios, você pode começar a fazer exercícios, etc.
          </Text>
          <Text style={styles.footerText}>
            O Death Date não é responsável por qualquer morte que ocorra após o
            uso do aplicativo.
          </Text>
          <Text style={styles.footerTextSlogan}>
            Death Date, por que amanhã pode ser tarde demais.
          </Text>
          <Button
            style={styles.borderlessButtonContainer}
            borderless
            title={"Voltar para o login"}
            onPress={() => navigation.navigate("Login")}
          />
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 18,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.black,
    paddingTop: 20,
    textAlign: "center",
  },
  footer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingBottom: 48,
    alignItems: "center",
  },
  footerText: {
    fontSize: 20,
    fontWeight: "400",
    color: Colors.orange,
    marginTop: 10,
  },
  footerTextSlogan: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.orange,
    marginTop: 10,
    textAlign: "center",
  },
  button: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: Colors.orange,
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: "700",
  },
  borderlessButtonContainer: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    color: "#000",
  },
});
