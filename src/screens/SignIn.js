import * as React from 'react';
import {
    View,
    Text,
    Image,
    Alert,
    StyleSheet,
    Modal,
    TouchableOpacity,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import PhoneInput from 'react-native-phone-number-input';
import firebaseSetup from '../../config/firebase';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignInScreen = ({ navigation }) => {
    const { auth, firestore } = firebaseSetup();

    const [value, setValue] = React.useState('');
    const [countryCode, setCountryCode] = React.useState('');
    const [otp, setOtp] = React.useState('');
    const [formattedValue, setFormattedValue] = React.useState('');
    const [confirm, setConfirm] = React.useState(null);

    const signInWithPhoneNumber = async phoneNumber => {
        try {
            const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
            setConfirm(confirmation);
        } catch (e) {
            Alert.alert(e.message);
        }
    };

    const _setItem = async val => {
        try {
            await AsyncStorage.setItem('CURRENT_USER', val);
        } catch (e) {
            console.error(e);
        }
    };

    const confirmOTP = async () => {
        try {
            await confirm.confirm(otp);

            const UID = auth().currentUser.uid;
            _setItem(UID);

            const ref = firestore().collection('Users');
            const USER_DOC = await ref.doc(UID).get();

            if (USER_DOC.exists) {
                //alert("Already registered")
                navigation.navigate('main');
            } else {
                navigation.navigate('register', { formattedValue });
            }
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const phoneInput = React.useRef(null);

    return (
        <View style={styles.container}>
            <View>
                {confirm ? (
                    <TouchableOpacity
                        style={{ marginLeft: 15 }}
                        onPress={() => setConfirm(null)}>
                        <AntDesign name="left" size={24} color="#86329b" />
                    </TouchableOpacity>
                ) : undefined}
                <View style={{ alignItems: 'center' }}>
                    <Image
                        source={require('../assets/_logo.png')}
                        resizeMode="cover"
                        style={{ height: 200, width: 200 }}
                    />
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        marginLeft: 30,
                    }}>
                    <Text style={{ color: '#86329b', fontSize: 42, fontWeight: '900' }}>
                        Chatty
                    </Text>
                </View>
            </View>
            {!confirm ? (
                <View style={{ alignItems: 'center' }}>
                    <PhoneInput
                        ref={phoneInput}
                        defaultValue={value}
                        defaultCode="US"
                        layout="first"
                        onChangeText={text => {
                            setValue(text);
                        }}
                        onChangeFormattedText={text => {
                            setFormattedValue(text);
                            setCountryCode(
                                phoneInput.current?.getCountryCode() || countryCode,
                            );
                        }}
                        countryPickerProps={{ withAlphaFilter: true }}
                        //withDarkTheme
                        withShadow
                        autoFocus
                    />
                </View>
            ) : (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <OTPInputView
                        style={{ width: '85%', height: 65 }}
                        pinCount={6}
                        code={otp}
                        onCodeChanged={code => setOtp(code)}
                        autoFocusOnLoad
                        codeInputFieldStyle={styles.underlineStyleBase}
                        codeInputHighlightStyle={styles.underlineStyleHighLighted}
                        onCodeFilled={code => {
                            setOtp(code);
                            console.log(`Code is ${code}, you are good to go!`);
                        }}
                    />
                    <Text style={{ textAlign: 'center', marginTop: 10 }}>
                        An otp has been sent to {formattedValue}
                    </Text>
                </View>
            )}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                {!confirm ? undefined : (
                    <TouchableOpacity
                        onPress={() => {
                            signInWithPhoneNumber(formattedValue);
                        }}
                        style={styles.button}>
                        <Fontisto name="undo" size={28} color="white" />
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    onPress={() => {
                        //Alert.alert(!confirm ? formattedValue : otp);
                        if (!confirm && value.length >= 10) {
                            try {
                                signInWithPhoneNumber(formattedValue);
                            } catch (e) {
                                Alert.alert(':(', 'OOPS!Something went wrong...');
                                //console.error(e);
                            }
                        } else {
                            confirmOTP();
                        }
                    }}
                    style={styles.button}>
                    <AntDesign name="arrowright" size={30} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        backgroundColor: 'white',
    },
    button: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#86329b',
        height: 70,
        width: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
    },
    borderStyleBase: {
        width: 45,
        height: 45,
    },

    borderStyleHighLighted: {
        borderColor: '#86329b',
    },

    underlineStyleBase: {
        width: 45,
        height: 45,
        borderWidth: 2,
        //borderBottomWidth: 1,
    },

    underlineStyleHighLighted: {
        borderColor: '#86329b',
    },
});
export default SignInScreen;
