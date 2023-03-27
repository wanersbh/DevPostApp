import React, { useContext } from 'react';
import { Button, Text, View } from 'react-native';

import { AuthContext } from '../../contexts/auth';

export default function Profile() {

    const { signOut, user } = useContext(AuthContext);

    return (
        <View>
            <Text>TELA PROFILE: {user.nome}</Text>
            <Button title='Sair' onPress={signOut} />
        </View>
    );
}