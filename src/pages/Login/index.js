import React, { useState, useContext } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { AuthContext } from '../../contexts/auth';

import { Container, Title, Input, Button, ButtonText, SignUpButton, SignUpText } from './styles'

import * as Animatable from 'react-native-animatable';

const TitleAnimated = Animatable.createAnimatableComponent(Title);

export default function Login() {

    const { signUp, signIn, loadingAuth } = useContext(AuthContext);

    const [login, setLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function toggleLogin() {
        setLogin(!login);
        setName('');
        setEmail('');
        setPassword('');
    }

    async function handleSignIn() {
        if (email === '' || password === '') {
            console.log('PREENCHA TODOS OS CAMPOS');
            return;
        }

        //Efetua o login 
        await signIn(email, password);
    }

    async function handleSignUp() {
        if (name === '' || email === '' || password === '') {
            console.log('PREENCHA TODOS OS CAMPOS');
            return;
        }

        //Cadastrar o usuário no sistema
        await signUp(name, email, password);
    }

    if (login) {
        return (
            <Container>
                <TitleAnimated animation='flipInY'>
                    Dev<Text style={{ color: '#E52246' }}>Post</Text>
                </TitleAnimated>

                <Input
                    placeholder="seuemail@teste.com"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
                <Input
                    placeholder="********"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry={true}
                />

                <Button onPress={handleSignIn}>
                    {loadingAuth ? <ActivityIndicator size={30} color='#FFF' />
                        : (<ButtonText>Acessar</ButtonText>)
                    }

                </Button>

                <SignUpButton onPress={toggleLogin}>
                    <SignUpText>Criar uma conta</SignUpText>
                </SignUpButton>

            </Container>
        );
    }

    return (
        <Container>
             <TitleAnimated animation='bounceInRight' >
                Dev<Text style={{ color: '#E52246' }}>Post</Text>
            </TitleAnimated>

            <Input
                placeholder="Seu nome"
                value={name}
                onChangeText={(text) => setName(text)}
            />
            <Input
                placeholder="seuemail@teste.com"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
            <Input
                placeholder="********"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
            />

            <Button onPress={handleSignUp}>
                {loadingAuth ? <ActivityIndicator size={30} color='#FFF' /> :
                    (<ButtonText>Cadastrar</ButtonText>)
                }
            </Button>

            <SignUpButton onPress={toggleLogin}>
                <SignUpText>Já possuo uma conta</SignUpText>
            </SignUpButton>

        </Container>
    );
}