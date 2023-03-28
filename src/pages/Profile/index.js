import React, { useContext, useState } from 'react';

import { AuthContext } from '../../contexts/auth';

import {
    ButtonText,
    ButtonUpdate,
    Container,
    Email,
    Name,
    UploadButton,
    UploadText,
    Avatar,
    ModalContainer,
    ButtonBack,
    Input
} from './styles';

import Icon from 'react-native-vector-icons/Feather';

import firestore from '@react-native-firebase/firestore';

import Header from '../../components/Header';
import { Modal, Platform } from 'react-native';

export default function Profile() {

    const { signOut, user, setUser, storageUser } = useContext(AuthContext);

    const [nome, setNome] = useState(user?.nome);
    const [url, setUrl] = useState(null);
    const [open, setOpen] = useState(false);

    async function handleSignOut() {
        await signOut();
    }

    async function updateProfile() {
        if (nome === '') {
            return;
        }

        //Atualiza o nome na collection users
        await firestore().collection('users').doc(user.uid).update({
            nome: nome
        });

        //Buscar todos posts desse user e atulizar o nome dele
        const postDocs = await firestore().collection('posts')
            .where('userId', '==', user?.uid).get();

        //Percorrer todos posts desse user e atualizar
        postDocs.forEach( async doc => {
            await firestore().collection('posts').doc(doc.id).update({
                autor: nome
            })
        })

        let data = {
            uid: user.uid,
            nome: nome,
            email: user.email 
        }

        setUser(data);
        storageUser(data);
        setOpen(false);
    }

    return (
        <Container>
            <Header />

            {url ? (
                <UploadButton onPress={() => alert('CLICOU 1')}>
                    <UploadText>+</UploadText>
                    <Avatar
                        source={{ uri: url }}
                    />
                </UploadButton>
            ) : (
                <UploadButton onPress={() => alert('CLICOU 2')}>
                    <UploadText>+</UploadText>
                </UploadButton>
            )}

            <Name>{nome}</Name>
            <Email>{user?.email}</Email>

            <ButtonUpdate bg="#428cfd" onPress={() => setOpen(true)}>
                <ButtonText color="#FFF">Atualizar Perfil</ButtonText>
            </ButtonUpdate>

            <ButtonUpdate bg="#DDD" onPress={handleSignOut}>
                <ButtonText color="#353840">Sair</ButtonText>
            </ButtonUpdate>

            <Modal visible={open} animationType='slide' transparent={true}>
                <ModalContainer behavior={Platform.OS === 'android' ? '' : 'padding'}>
                    <ButtonBack onPress={() => setOpen(false)}>
                        <Icon
                            name='arrow-left'
                            size={22}
                            color='#121212'
                        />
                        <ButtonText color='#121212'>Voltar</ButtonText>
                    </ButtonBack>
                    <Input
                        placeholder={user?.nome}
                        value={nome}
                        onChangeText={(text) => setNome(text)}
                    />

                    <ButtonUpdate bg="#428cfd" onPress={updateProfile}>
                        <ButtonText color="#FFF">Salvar</ButtonText>
                    </ButtonUpdate>
                </ModalContainer>

            </Modal>

        </Container>
    );
}