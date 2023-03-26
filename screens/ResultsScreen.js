import React, { useState } from "react";
import { Text, StyleSheet, Switch } from "react-native";
import { Formik } from "formik";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Picker } from "@react-native-picker/picker";

import { View, TextInput, Logo, Button } from "../components";
import { Colors, auth } from "../config";

export const ResultsScreen = ({ navigation }) => {
  const handleSave = (values) => {
    console.log(values);
    const user = auth.currentUser;
    console.log(user.uid);
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
    const cleaned = text.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{4})$/);
    if (match) {
      return `${match[1]}/${match[2]}/${match[3]}`;
    }
    return text;
  };

  const handleChangeText = (text) => {
    setValue(formatDate(text));
  };

  const [selectedGender, setSelectedGender] = useState("masculino");

  let STATES = [
    { name: "Rio Grande do Sul", age: 75 },
    { name: "Santa Catarina", age: 75.3 },
    { name: "Paraná", age: 74.1 },
    { name: "São Paulo", age: 74.2 },
    { name: "Rio de Janeiro", age: 73.1 },
    { name: "Goiás", age: 71.4 },
    { name: "Mato Grosso do Sul", age: 73.8 },
    { name: "Mato Grosso", age: 73.1 },
    { name: "Rondônia", age: 71.2 },
    { name: "Acre", age: 71.4 },
    { name: "Amazonas", age: 71.6 },
    { name: "Roraima", age: 69.9 },
    { name: "Amapá", age: 70.4 },
    { name: "Pará", age: 72 },
    { name: "Maranhão", age: 67.6 },
    { name: "Piauí", age: 68.9 },
    { name: "Ceará", age: 70.3 },
    { name: "Rio Grande do Norte", age: 70.4 },
    { name: "Paraíba", age: 69 },
    { name: "Pernambuco", age: 68.3 },
    { name: "Alagoas", age: 66.8 },
    { name: "Sergipe", age: 70 },
    { name: "Bahia", age: 69.5 },
    { name: "Minas Gerais", age: 72.1 },
    { name: "Espírito Santo", age: 72.3 },
    { name: "Distrito Federal", age: 74.2 },
  ];

  STATES.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  const [selectedState, setSelectedState] = useState(null);

  const handleStateChange = (value) => {
    setSelectedState(value);
  };

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
            gender: "masculimo",
            height: "",
            weight: "",
            isSmoker: false,
            isAlcoholic: false,
            usesDrugs: false,
            exercises: 0,
            isAnxious: false,
            hasDepression: false,
            isDiabethic: false,
            hasHypertension: false,
            hasHeartDisease: false,
            hasCancer: false,
            hasHepatitis: false,
            stateLiving: "",
          }}
          onSubmit={handleSave}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            setFieldValue,
          }) => (
            <View>
              <Text style={styles.footerText}>Data de nascimento:</Text>
              <TextInput
                placeholder="dd/mm/yyyy"
                keyboardType="numeric"
                value={formatDate(values.dateOfBirth)}
                onChangeText={handleChange("dateOfBirth")}
                onBlur={handleBlur("dateOfBirth")}
              />
              <View>
                <Text style={styles.footerText}>Selecione seu gênero:</Text>
                <Picker
                  style={styles.picker}
                  selectedValue={gender}
                  onValueChange={(itemValue) => {
                    setGender(itemValue);
                    setFieldValue("gender", itemValue);
                  }}
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
              <Text style={styles.footerText}>Selecione o estado:</Text>
              <Picker
                selectedValue={selectedState}
                onValueChange={(value) => {
                  setFieldValue("stateLiving", value);
                  handleStateChange(value);
                }}
                style={styles.picker}
              >
                <Picker.Item label="" value={null} />
                {STATES.map((state) => (
                  <Picker.Item
                    key={state.name}
                    label={state.name}
                    value={state.name}
                  />
                ))}
              </Picker>
              <View style={styles.switchContainer}>
                <Text style={styles.footerText}>É fumante?:</Text>
                <Switch
                  value={values.isSmoker}
                  onValueChange={(value) => setFieldValue("isSmoker", value)}
                />
              </View>
              <View style={styles.switchContainer}>
                <Text style={styles.footerText}>É alcoólatra?:</Text>
                <Switch
                  value={values.isAlcoholic}
                  onValueChange={(value) => setFieldValue("isAlcoholic", value)}
                />
              </View>
              <View style={styles.switchContainer}>
                <Text style={styles.footerText}>Usa drogas?:</Text>
                <Switch
                  value={values.usesDrugs}
                  onValueChange={(value) => setFieldValue("usesDrugs", value)}
                />
              </View>
              <View style={styles.switchContainer}>
                <Text style={styles.footerText}>Tem asiedade?:</Text>
                <Switch
                  value={values.isAnxious}
                  onValueChange={(value) => setFieldValue("isAnxious", value)}
                />
              </View>
              <View style={styles.switchContainer}>
                <Text style={styles.footerText}>Tem depressão?:</Text>
                <Switch
                  value={values.hasDepression}
                  onValueChange={(value) =>
                    setFieldValue("hasDepression", value)
                  }
                />
              </View>
              <View style={styles.switchContainer}>
                <Text style={styles.footerText}>Tem diabetes?:</Text>
                <Switch
                  value={values.isDiabethic}
                  onValueChange={(value) => setFieldValue("isDiabethic", value)}
                />
              </View>
              <View style={styles.switchContainer}>
                <Text style={styles.footerText}>Tem hipertensão?:</Text>
                <Switch
                  value={values.hasHypertension}
                  onValueChange={(value) =>
                    setFieldValue("hasHypertension", value)
                  }
                />
              </View>
              <View style={styles.switchContainer}>
                <Text style={styles.footerText}>Tem doença cardíaca?:</Text>
                <Switch
                  value={values.hasHeartDisease}
                  onValueChange={(value) =>
                    setFieldValue("hasHeartDisease", value)
                  }
                />
              </View>
              <View style={styles.switchContainer}>
                <Text style={styles.footerText}>Tem câncer?:</Text>
                <Switch
                  value={values.hasCancer}
                  onValueChange={(value) => setFieldValue("hasCancer", value)}
                />
              </View>
              <View style={styles.switchContainer}>
                <Text style={styles.footerText}>Tem hepatite?:</Text>
                <Switch
                  value={values.hasHepatitis}
                  onValueChange={(value) =>
                    setFieldValue("hasHepatitis", value)
                  }
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
