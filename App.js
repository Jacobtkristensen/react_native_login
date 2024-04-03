import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Platform, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { app, database } from './firebase';
import { addDoc, collection } from 'firebase/firestore';
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  onAuthStateChanged, initializeAuth, getReactNativePersistence, signOut
} from 'firebase/auth';


let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence()
  });
}



export default function App() {
  const API_KEY = "AIzaSyCus1BhGk85twMcpQqatjUkJJ65vfZuMv0"
  const url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="
  const urlSignUp = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="
  const [enteredEmail, setEnteredEmail] = useState("test12@test.dk")
  const [enteredPassword, setEnteredPassword] = useState("test12")
  const [userId, setUserId] = useState(null)
  const [enteredText, setEnteredText] = useState("type here")

  useEffect(() => {
    const auth_ = getAuth();
    const unsubscribe = onAuthStateChanged(auth_, (currentUser) => {
      if (currentUser) {
        setUserId(currentUser.uid);
      } else {
        setUserId(null);
      }
    })
    return () => unsubscribe();
  }, []);

  async function addNote() {
    try {
      await addDoc(collection(database, userId), {
        text: enteredText
      })
    } catch (error) {
      console.log("error addDocument " + error)
    }
  }


  async function login() {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, enteredEmail, enteredPassword)
      console.log("logged in " + userCredential.user.uid)
    } catch (error) {
      console.log("error login " + error)
    }
  }


  async function signup() {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, enteredEmail, enteredPassword)
      console.log("signed up " + userCredential.user.uid)
    } catch (error) {
      console.log("error signup " + error)
    }

  }

  async function sign_out() {
    await signOut(auth);
    console.log("signed out")
  }

  return (
    <View style={styles.container}>
      {!userId &&
        <>
          <Text>Login</Text>
          <TextInput style={styles.input}
            onChangeText={newText => setEnteredEmail(newText)}
            value={enteredEmail}
          />
          <TextInput style={styles.input}
            onChangeText={newText => setEnteredPassword(newText)}
            value={enteredPassword}
          />
          <TouchableOpacity style={styles.button} onPress={login}>
            <Text style={styles.buttonText}>Log in</Text>
          </TouchableOpacity>


          <TextInput style={styles.input}
            onChangeText={newText => setEnteredEmail(newText)}
            value={enteredEmail}
          />
          <TextInput style={styles.input}
            onChangeText={newText => setEnteredPassword(newText)}
            value={enteredPassword}
          />
          <TouchableOpacity style={styles.button} onPress={signup}>
            <Text style={styles.buttonText}>Signup</Text>
          </TouchableOpacity>
        </>
      }
      {userId &&
        <>
          <Text style={styles.title}>Welcome {userId}</Text>
          <TextInput style={styles.input}
            onChangeText={newText => setEnteredText(newText)}
            value={enteredText}
          />
          <TouchableOpacity style={styles.button} onPress={addNote}>
            <Text style={styles.buttonText}>Add new Note</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={sign_out}>
            <Text style={styles.buttonText}>Signout</Text>
          </TouchableOpacity>
        </>
      }
    </View>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%',
    borderColor: '#6C757D', 
    borderRadius: 5,
    backgroundColor: '#FFFFFF', 
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF', 
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#212529', 
  },
  noteText: {
    marginTop: 20,
    fontSize: 16,
    color: '#495057', 
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%',
    borderColor: '#6C757D',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
});