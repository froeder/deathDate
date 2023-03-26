import React, { useState, useEffect } from 'react';
import { StyleSheet, Text , ScrollView} from 'react-native';
import { View, TextInput, Logo, Button, FormErrorMessage } from '../components';
import { signOut } from 'firebase/auth';

import { auth, Colors } from '../config';

export const ProfileScreen = () => {

  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = () => {
    signOut(auth).catch(error => console.log('Error logging out: ', error));
  };

   useEffect(() => {
    const currentUser = auth.currentUser.uid ;
    /* 
    const currentUser = auth().currentUser;
    const userRef = firestore().collection('users').doc(currentUser.uid);

    userRef.get().then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        setUser(userData);
        setName(userData.name);
        setEmail(userData.email);
      }
      setIsLoading(false);
    });
    */
  }, []);

  const handleUpdateProfile = () => {
    const userRef = firestore().collection('users').doc(user.uid);

    userRef.update({ name, email }).then(() => {
      setUser({ ...user, name, email });
    });
  };

  /* if (isLoading) {
    return <Text>Carregando...</Text>;
  }*/

  return (
    <View isSafe style={styles.container}>
      <ScrollView>
        <TextInput 
          name='nome'
          leftIconName='account'
          placeholder='Nome' value={name} 
          onChangeText={setName} 
        />
        <TextInput value={email} onChangeText={setEmail} />
        <Button style={styles.button} onPress={handleUpdateProfile}>
          <Text style={styles.buttonText}>Atualizar</Text>
        </Button>
        <Button borderless style={styles.borderlessButtonContainer} onPress={handleLogout} title="Sair"/>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 18
  },
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: Colors.orange,
    padding: 10,
    borderRadius: 8
  },
  buttonText: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '700'
  },
  borderlessButtonContainer: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    color: "#000"
  }
});