import * as React from 'react';
import {
    View,
    Image,
    StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {

    const getUser = async () => {
        try {
            const response = await AsyncStorage.getItem('CURRENT_USER');
            return response;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    React.useEffect(async () => {
        const user = await getUser();
        console.log(user);

        setTimeout(() => {
            if (!user) {
                navigation.navigate('auth');
            } else {
                navigation.navigate('main');
            }
        }, 2000)
    }, [])

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/_logo.png')}
                resizeMode="cover"
                style={{ height: 200, width: 200 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    }
});

export default SplashScreen;