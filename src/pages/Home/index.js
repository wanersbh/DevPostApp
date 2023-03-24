import React, { useState } from 'react';

import { Text } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import { useNavigation } from '@react-navigation/native';

import Header from '../../components/Header';
import { ButtonPost, Container, ListPosts } from './styles';

export default function Home() {

  const navigation = useNavigation();
  const [posts, setPosts] = useState([
    { id: '1', content: 'TESTE123' },
    { id: '2', content: 'SEGUNDO POST' },
    { id: '3', content: 'TERCEIRO POST' }
  ]);

  return (
    <Container>
      <Header />

      <ListPosts
        data={posts}
        renderItem={(item) => (<Text>TESTE</Text>)}
      />

      <ButtonPost
        activeOpacity={0.5}
        onPress={() => navigation.navigate("NewPost")}
      >
        <Icon
          name="edit-2"
          color="#FFF"
          size={25}
        />
      </ButtonPost>
    </Container>
  );
}