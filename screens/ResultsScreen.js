import React, { useState } from "react";
import { Text, StyleSheet, Switch } from "react-native";
import { Formik } from "formik";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Checkbox from "expo-checkbox";
import { Picker } from "@react-native-picker/picker";

import { View, TextInput, Logo, Button } from "../components";
import { Colors, auth } from "../config";

export const ResultsScreen = ({ navigation }) => {
  const handleSave = (values) => {
    const user = auth.currentUser;
    console.log(user);
    return;
    db.collection("users")
      .doc(user.uid)
      .set(values)
      .then(() => {
        console.log("Data saved successfully!");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [value, setValue] = useState("");
  const [gender, setGender] = useState(null);

  const formatDate = (text) => {
    const cleaned = text.replace(/\D/g, ""); // remove tudo que não é dígito
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{4})$/); // captura dia, mês e ano
    if (match) {
      return `${match[1]}/${match[2]}/${match[3]}`;
    }
    return text;
  };

  const handleChangeText = (text) => {
    setValue(formatDate(text));
  };

  const [selectedGender, setSelectedGender] = useState("masculino");

  return (
    <View isSafe style={styles.container}>
      <KeyboardAwareScrollView enableOnAndroid={true}>
        <View style={styles.logoContainer}>
          <Text style={styles.screenTitle}>
            Para começar, responda esse pequeno formulário
          </Text>
        </View>
        <Formik
          initialValues={{
            dateOfBirth: "",
            gender: "",
            height: "",
            weight: "",
            isSmoker: false,
            isAlcoholic: false,
            usesDrugs: false,
            exercises: "",
            isAnxious: false,
            hasDepression: false,
          }}
          onSubmit={handleSave}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View>
              <Text style={styles.footerText}>Data de nascimento:</Text>
              <TextInput
                placeholder="dd/mm/yyyy"
                keyboardType="numeric"
                value={value}
                onChangeText={handleChangeText}
              />
              <View>
                <Text style={styles.footerText}>Selecione seu gênero:</Text>
                <Picker
                  style={styles.picker}
                  selectedValue={selectedGender}
                  onValueChange={(itemValue) => setSelectedGender(itemValue)}
                >
                  <Picker.Item label="Masculino" value="masculino" />
                  <Picker.Item label="Feminino" value="feminino" />
                </Picker>
              </View>
              <Text style={styles.footerText}>Altura em cm:</Text>
              <TextInput
                onChangeText={handleChange("height")}
                onBlur={handleBlur("height")}
                value={values.height}
              />
              <Text style={styles.footerText}>Peso em kg:</Text>
              <TextInput
                onChangeText={handleChange("weight")}
                onBlur={handleBlur("weight")}
                value={values.weight}
              />
              <Text style={styles.footerText}>
                Pratica exercícios? Se sim coloque quantos minutos por semana:
              </Text>
              <TextInput
                onChangeText={handleChange("exercises")}
                onBlur={handleBlur("exercises")}
                value={values.exercises}
                defaultValue="0"
              />
              <View style={styles.switchContainer}>
                <Text style={styles.footerText}>É fumante?:</Text>
                <Switch
                  onValueChange={handleChange("isSmoker")}
                  value={values.isSmoker}
                />
              </View>
              <View style={styles.switchContainer}>
                <Text style={styles.footerText}>É alcoólatra?:</Text>
                <Switch
                  onValueChange={handleChange("isAlcoholic")}
                  value={values.isAlcoholic}
                />
              </View>
              <View style={styles.switchContainer}>
                <Text style={styles.footerText}>Usa drogas?:</Text>
                <Switch
                  onValueChange={handleChange("usesDrugs")}
                  value={values.usesDrugs}
                />
              </View>
              <View style={styles.switchContainer}>
                <Text style={styles.footerText}>É ansioso?:</Text>
                <Switch
                  onValueChange={handleChange("isAnxious")}
                  value={values.isAnxious}
                />
              </View>
              <View style={styles.switchContainer}>
                <Text style={styles.footerText}>Tem depressão?:</Text>
                <Switch
                  onValueChange={handleChange("hasDepression")}
                  value={values.hasDepression}
                />
              </View>
              <Button style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Salvar</Text>
              </Button>
            </View>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
  },
  logoContainer: { paddingBottom: 10 },
  screenTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.black,
    paddingTop: 20,
  },
  footer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingBottom: 48,
    alignItems: "center",
  },
  footerText: {
    fontSize: 18,
    fontWeight: "400",
    color: Colors.orange,
    marginTop: 10,
  },
  button: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: Colors.orange,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
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
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  picker: {
    backgroundColor: "#f2f2f2",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  switchContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
