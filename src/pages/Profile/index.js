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
import storage from '@react-native-firebase/storage';

import Header from '../../components/Header';
import { Modal, Platform } from 'react-native';

import { launchImageLibrary } from 'react-native-image-picker';

export default function Profile() {

    const { signOut, user, setUser, storageUser } = useContext(AuthContext);

    const [nome, setNome] = useState(user?.nome);
    const [url, setUrl] = useState(null);
    const [open, setOpen] = useState(false);

    async function handleSignOut() {
        await signOut();
    }

    // Atualizar o perfil
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
        postDocs.forEach(async doc => {
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

    const uploadFile = () => {
        const options = {
            noData: true,
            mediaType: 'photo'
        };

        launchImageLibrary(options, response => {
            if (response.didCancel) {
                console.log('Cancelou');
            } else if (response.errorCode) {
                console.log('Ops parece que deu algum erro');
            } else {
                // Aqui subir para o firebase
                uploadFileFirebase(response).then(() => {
                    uploadAvatarPosts();
                })

                setUrl(response.assets[0].uri);
            }
        })
    }

    //extrair e retornar a url da foto
    const getFileLocalPath = (response) => {
        return response.assets[0].uri;
    }

    const uploadFileFirebase = async (response) => {
        const fileSource = getFileLocalPath(response);

        const storageRef = storage().ref('users').child(user?.uid);

        return await storageRef.putFile(fileSource);
    }

    const uploadAvatarPosts = async () => {
        const storageRef = storage().ref('users').child(user?.uid);
        const url = await storageRef.getDownloadURL()
            .then(async (image) => {
                //Atualizar todas imagens dos posts desse user
                const postDocs = await firestore().collection('posts')
                    .where('userId', '==', user.uid).get();

                //Percorrer todos posts e trocar a url da imagem
                postDocs.forEach(async doc => {
                    await firestore().collection('posts').doc(doc.id).update({
                        avatarUrl: image
                    })
                })

            })
            .catch((error)=> {
                console.log('Erros ao atualizar a foto: ', error);
            })
    }

    return (
        <Container>
            <Header />

            {url ? (
                <UploadButton onPress={() => uploadFile()}>
                    <UploadText>+</UploadText>
                    <Avatar
                        source={{ uri: url }}
                    />
                </UploadButton>
            ) : (
                <UploadButton onPress={() => uploadFile()}>
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