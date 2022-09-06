import * as React from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { REACT_APP_STREAM_API_KEY } from "../../env";
import { StreamChat } from "stream-chat";
import { useNavigation, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
    Chat,
    Channel,
    MessageList,
    MessageInput,
    ChannelList,
    Thread,
} from "stream-chat-react-native";

const API_KEY = REACT_APP_STREAM_API_KEY;

const user = {
    id: '3594',
    name: 'as.Rizvi',
    image: 'https://scontent.fdac8-1.fna.fbcdn.net/v/t1.6435-9/78909259_102006534627171_2775140650989912064_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=ka3GFOCOKBsAX8ma-Bj&_nc_ht=scontent.fdac8-1.fna&oh=00_AT-lrgcvMLiVWD1zALDZQ-lEFxB4aRYDTHyFHHM1A5MmSg&oe=63086CC7'
}

const filters = {
    members: {
        '$in': [user.id]
    },
};

const sort = {
    last_message_at: -1,
};


const chatClient = StreamChat.getInstance(API_KEY);

const Stack = createStackNavigator();

const ChannelScreen = () => {
    const navigation = useNavigation();

    return (
        <ChannelList sort={sort} filters={filters}
            onSelect={(channel) => {
                navigation.navigate('Hello', { channel });
                //console.log(channel);
            }}
        />
    );
}

const ChatScreen = props => {
    //const navigation = useNavigation();
    const { route, navigation } = props;
    const { params: { channel } } = route;

    //return null;
    return (
        <View style={{ backgroundColor: 'purple' }}>
            <Channel channel={channel}>
                <MessageList
                    onThreadSelect={(message) => {
                        if (channel?.id) {
                            navigation.navigate('Thread', { channel, message });
                        }
                    }}
                    hideStickyDateHeader
                />
                <MessageInput />
            </Channel>
        </View>
    );
}

const ThreadScreen = props => {
    const { route } = props;
    const { params: { channel, message } } = route;

    //return null;
    return (
        <Channel channel={channel} thread={message} threadList>
            <Thread />
        </Channel>
    );
}

const ChatStack = ({ navigation, route }) => {
    const [client, setClient] = React.useState('');
    const [channel, setChannel] = React.useState('');

    // hide tab bar based on route name
    React.useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        const routeList = ["Hello", "Thread"];

        if (routeList.includes(routeName)) {
            navigation.setOptions({ tabBarVisible: false });
        } else {
            navigation.setOptions({ tabBarVisible: true });
        }
    }, [navigation, route])

    React.useEffect(() => {
        const init = async () => {
            try {
                //const TOKEN = await chatClient.createToken(user.id);

                await chatClient.connectUser(user, chatClient.devToken(user.id));

                const channel = chatClient.channel("messaging", "ChatRoom", {
                    image: "https://static.vecteezy.com/system/resources/previews/004/413/153/original/outlined-icon-of-group-of-people-doing-discussion-suitable-for-design-element-of-teamwork-discussion-social-networking-and-business-forum-free-vector.jpg",
                    name: "Chat about it",
                    members: [user.id],
                })

                await channel.watch();

                setChannel(channel);
                setClient(chatClient);

            } catch (e) {
                if (e instanceof Error) {
                    console.error(`An error occured while connecting user: ${e.message}`);
                    Alert.alert(title = 'Connection Timeout!', message = 'Please try again later...');
                }
            }
        }

        if (!chatClient.userID) {
            init();
        }
        //if (client) return () => client.disconnectUser();
    }, [])

    if (!channel || !client) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size={'large'} color={"purple"} />
            </View>
        );
    }

    return (
        <Chat client={client}>
            <Stack.Navigator
                screenOptions={{
                    headerTitleAlign: 'center',
                    headerTintColor: 'purple',
                    headerTitleStyle: { color: 'black' },
                    headerBackTitle: false,
                    headerStyle: {
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 0,
                    }
                }}
            >
                <Stack.Screen
                    name="Chats"
                    component={ChannelScreen}
                    options={{
                        headerLeft: () => null,
                        gestureEnabled: false
                    }}
                />
                <Stack.Screen name="Hello" component={ChatScreen} />
                <Stack.Screen name="Thread" component={ThreadScreen} />
            </Stack.Navigator>
        </Chat>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default ChatStack;