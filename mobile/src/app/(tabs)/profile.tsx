import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/useAuthStore';
import tw from 'twrnc';

export default function ProfileScreen() {
    const { user } = useAuthStore();
    return (
        <SafeAreaView style={tw`flex-1 bg-black justify-center items-center`}>
            <Text style={tw`text-white font-bold text-2xl`}>Holographic ID</Text>
            <Text style={tw`text-slate-400 mt-2`}>Connecting proxy for: {user?.name}</Text>
        </SafeAreaView>
    );
}
