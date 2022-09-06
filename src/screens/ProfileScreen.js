import * as React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebaseSetup from '../../config/firebase';

const { auth, firestore, storage } = firebaseSetup();
const currentUser = auth().currentUser;
const ref = firestore().collection('Users');

const ProfileScreen = ({ navigation }) => {

    const clearLocal = async () => {
        try {
            await AsyncStorage.removeItem('CURRENT_USER');
        } catch (e) {
            console.error(e);
        }
    }

    const signOut = () => {
        auth().signOut().then(() => {
            console.log('USER logged out!');
            clearLocal();

            navigation.navigate('auth');
        })
    }

    const deleteAccount = async () => {
        try {
            await ref.doc(currentUser.uid).delete();
            await storage().ref(currentUser.uid).delete();

            await currentUser.delete();
            clearLocal();

            navigation.navigate('auth');

        } catch (e) {
            console.error(e);
        }
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: 'grey', fontSize: 18, textAlign: 'center' }}>
                {`USER PROFILE: ${currentUser.uid}`}
            </Text>
            <Image source={{ uri: `${currentUser.photoURL}` }} style={{ height: 150, width: 150, borderRadius: 75 }} />
            <Text>
                {`USER NAME: ${currentUser.displayName}`}
            </Text>
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity onPress={signOut}>
                    <Text style={{ color: 'purple', fontSize: 24, fontWeight: '700' }}>
                        SIGN OUT
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={deleteAccount}>
                    <Text style={{ color: 'tomato', fontSize: 24, fontWeight: '700' }}>
                        DELETE ACCOUNT
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default ProfileScreen;