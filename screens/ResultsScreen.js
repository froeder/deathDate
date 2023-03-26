import React from "react";
import { Text, StyleSheet, Switch } from "react-native";
import { Formik } from "formik";
import { signInWithEmailAndPassword } from "firebase/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { View, TextInput, Logo, Button } from "../components";
import { Colors, auth } from "../config";

export const ResultsScreen = ({ navigation }) => {
    const handleSave = (values) => {
        const user = auth.currentUser;
            db.collection('users').doc(user.uid).set(values)
            .then(() => {
                console.log('Data saved successfully!');
            })
            .catch((error) => {
                console.log(error);
            });
    };

  return (
    <>
      <View isSafe style={styles.container}>
        <KeyboardAwareScrollView enableOnAndroid={true}>
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
                <Text>Date of Birth:</Text>
                <TextInput
                  onChangeText={handleChange("dateOfBirth")}
                  onBlur={handleBlur("dateOfBirth")}
                  value={values.dateOfBirth}
                />
                <Text>Gender:</Text>
                <TextInput
                  onChangeText={handleChange("gender")}
                  onBlur={handleBlur("gender")}
                  value={values.gender}
                />
                <Text>Height:</Text>
                <TextInput
                  onChangeText={handleChange("height")}
                  onBlur={handleBlur("height")}
                  value={values.height}
                />
                <Text>Weight:</Text>
                <TextInput
                  onChangeText={handleChange("weight")}
                  onBlur={handleBlur("weight")}
                  value={values.weight}
                />
                <Text>Smoker:</Text>
                <Switch
                  onValueChange={handleChange("isSmoker")}
                  value={values.isSmoker}
                />
                <Text>Alcoholic:</Text>
                <Switch
                  onValueChange={handleChange("isAlcoholic")}
                  value={values.isAlcoholic}
                />
                <Text>Uses Drugs:</Text>
                <Switch
                  onValueChange={handleChange("usesDrugs")}
                  value={values.usesDrugs}
                />
                <Text>Exercise:</Text>
                <TextInput
                  onChangeText={handleChange("exercises")}
                  onBlur={handleBlur("exercises")}
                  value={values.exercises}
                />
                <Text>Anxious:</Text>
                <Switch
                  onValueChange={handleChange("isAnxious")}
                  value={values.isAnxious}
                />
                <Text>Depression:</Text>
                <Switch
                  onValueChange={handleChange("hasDepression")}
                  value={values.hasDepression}
                />
                <Button onPress={handleSubmit} title="Save" />
              </View>
            )}
          </Formik>
        </KeyboardAwareScrollView>
      </View>

      
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
  },
  logoContainer: {
    alignItems: "center",
  },
  screenTitle: {
    fontSize: 32,
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
    fontSize: 14,
    fontWeight: "700",
    color: Colors.orange,
  },
  button: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: Colors.orange,
    padding: 10,
    borderRadius: 8,
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
