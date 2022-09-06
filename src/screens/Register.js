import * as React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    Platform,
    StatusBar,
    Alert,
    Modal
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import firebaseSetup from '../../config/firebase';

// https://quiet-brook-51580.herokuapp.com/user/create

const RegisterScreen = ({ navigation }) => {
    const [imgUrl, setImgUrl] = React.useState('');
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [token, setToken] = React.useState('');
    const [downloadURL, setDownloadURL] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);

    const { auth, storage, firestore } = firebaseSetup();
    const currentUser = auth().currentUser.uid;
    const ref = firestore().collection('Users');

    console.log(currentUser);

    const generateToken = (userID) => {
        fetch('https://quiet-brook-51580.herokuapp.com/user/create/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userID: userID
            })
        });
    }

    const getToken = (userID) => {
        fetch('https://quiet-brook-51580.herokuapp.com/user/read/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userID: userID
            })
        }).then(res => {
            const response = res.json();
            const data = response.data.token;

            setToken(data);
        });
    }

    const upload = async (imgUrl) => {
        try {
            const filename = `${currentUser}`;
            const ref = storage().ref(filename);

            await ref.putFile(imgUrl); // store file in database

            const url = await ref.getDownloadURL(); // fetch public url
            setDownloadURL(url);

            console.log('This is DOWNLOAD URL:' + url);

        } catch (e) {
            console.error(e);
        }
    }

    const chooseImage = () => {
        ImagePicker.openPicker({
            cropping: true
        }).then((image) => {
            console.log(image);
            const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
            console.log(imageUri);
            upload(imageUri);

            setImgUrl(imageUri);
        })
    }

    //console.log(`From state: ${downloadURL}`);

    const setupUser = async () => {
        setModalVisible(true);

        const user = auth().currentUser;
        const profile = {
            displayName: name,
            phoneNumber: user.phoneNumber,
            email: email,
            photoURL: downloadURL
        }

        try {
            user.updateProfile(profile); //auth client

            generateToken(currentUser);
            getToken(currentUser);

            profile['token'] = token;
            ref.doc(currentUser).set(profile, { merge: true }); // db

            console.log("Done");

            const doc = (await ref.doc(currentUser).get()).data();

            if (doc.token) {
                navigation.navigate('main', { doc });
                setModalVisible(false);
            } else {
                setupUser();
            }

        } catch (e) {
            setModalVisible(false);
            Alert.alert('Something went wrong! ;<')
            console.error(e);
        }
    }

    const ModalView = () => {
        return (
            <Modal
                animationType='fade'
                transparent={true}
            >
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <View style={{
                        marginTop: 30,
                        backgroundColor: '#e5eff1',
                        height: 300,
                        width: 350,
                        borderRadius: 25,
                        alignItems: 'center',
                        justifyContent: 'space-evenly'
                    }}>
                        <Image
                            source={require('../assets/processing.gif')}
                            style={{ height: 175, width: 175 }}
                        />
                        <View style={{ alignItems: 'center' }}>
                            <Text style={[styles.text, { color: 'teal' }]}>
                                Getting things ready
                            </Text>
                            <Text style={{ color: 'grey', fontWeight: '700' }}>Time may vary based on network connection</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <View style={styles.body}>
            <View style={{ paddingHorizontal: 25, paddingVertical: 25 }}>
                <Text style={styles.text}>
                    Create an Account
                </Text>
            </View>
            <View style={[styles.container, { backgroundColor: modalVisible ? 'darkgrey' : 'white' }]}>
                {modalVisible ? <ModalView /> : null}
                <TouchableOpacity style={styles.img} onPress={chooseImage}>
                    {
                        !imgUrl ?
                            <AntDesign name='user' color={'purple'} size={75} /> :
                            <Image source={{ uri: imgUrl }} style={{
                                height: 120, width: 120, borderRadius: 60,
                            }} />
                    }
                </TouchableOpacity>
                <View style={styles.textField}>
                    <TextInput
                        placeholder='Username'
                        style={styles.textInput}
                        onChangeText={(name) => setName(name)}
                    />
                </View>
                <View style={styles.textField}>
                    <TextInput
                        placeholder='Email (optional)'
                        style={styles.textInput}
                        onChangeText={(email) => setEmail(email)}
                    />
                </View>
                <TouchableOpacity style={[styles.textField, { backgroundColor: 'purple', alignItems: 'center' }]}
                    onPress={({ navigation }) => {
                        setupUser();
                    }}
                >
                    <Text style={styles.text}>
                        Register
                    </Text>
                </TouchableOpacity>
            </View>
            <StatusBar backgroundColor={'purple'} />
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: 'purple'
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 25,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    img: {
        height: 120,
        width: 120,
        borderRadius: 60,
        backgroundColor: 'lightgrey',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textField: {
        backgroundColor: 'lightgrey',
        height: 70,
        width: '100%',
        borderRadius: 15,
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    textInput: {
        fontSize: 18,
        fontWeight: '500',
    },
    text: {
        fontSize: 28,
        fontWeight: '700',
        color: 'white'
    }

});

export default RegisterScreen;