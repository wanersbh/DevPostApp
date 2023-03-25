import React, { useState, useContext, useCallback } from 'react';

import { ActivityIndicator, Text, View } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import { useNavigation, useFocusEffect } from '@react-navigation/native';

import Header from '../../components/Header';
import { ButtonPost, Container, ListPosts } from './styles';
import { AuthContext } from '../../contexts/auth';

import firestore from '@react-native-firebase/firestore';
import PostsList from '../../components/PostsList';

export default function Home() {

  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [posts, setPosts] = useState([
    { id: '1', content: 'TESTE123' },
    { id: '2', content: 'SEGUNDO POST' },
    { id: '3', content: 'TERCEIRO POST' }
  ]);

  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      function fetchPosts() {
        firestore().collection('posts')
          .orderBy('created', 'desc')
          .limit(5)
          .get()
          .then((snapshot) => {

            if (isActive) {
              setPosts([]);
              const postList = [];

              snapshot.docs.map(u => {
                postList.push({
                  ...u.data(),
                  id: u.id
                })
              })

              setPosts(postList);
              setLoading(false);

            }

          });
      }

      fetchPosts();

      return () => {
        isActive = false;
      }

    }, [])
  );


  return (
    <Container>
      <Header />

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size={60} color='#E52246' />
        </View>
      ) :
        (<ListPosts
          data={posts}
          renderItem={({item}) => (
            <PostsList
              data={item}
              userId={user?.uid}
            />
          )}
        />)
      }


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