import React, { useState } from 'react';
import {
    Container,
    Name,
    Hearder,
    Avatar,
    ContentView,
    Content,
    Actions,
    LikeButton,
    Like,
    TimePost
} from './styles';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import firestore from '@react-native-firebase/firestore';

export default function PostsList({ data, userId }) {

    const [likePost, setLikePost] = useState(data?.likes);

    function formatTimePost() {
        // console.log(new Date(data?.created.seconds * 1000));
        const datePost = new Date(data?.created.seconds * 1000);

        return formatDistance(
            new Date(),
            datePost,
            {
                locale: ptBR
            }
        )
    }

    async function handleLikePost(id, likes){
        const docId =`${userId}_${id}`;

        //checar se o post já foi curtido
        const doc = await firestore().collection('likes')
        .doc(docId).get();
        console.log('Id', id, 'Likes', likes);

        if(doc.exists){
            //Que dizer que já curtiu esse post então precisamos remover o like
            await firestore().collection('posts')
            .doc(id).update({
                likes: likes - 1
            })
            
            await firestore().collection('likes').doc(docId)
            .delete()
            .then(()=>{
                setLikePost(likes - 1)
            })
           return;
        }

        //Precisamos dar o like no post
        await firestore().collection('likes').doc(docId).set({
            postId: id,
            userId: userId
        })

        await firestore().collection('posts').doc(id).update({
            likes: likes + 1
        }).then(()=>{
            setLikePost(likes + 1)
        })
    }

    return (
        <Container>
            <Hearder>
                {data.avatarUrl ? (
                    <Avatar
                        source={{ uri: data.avatarUrl }}
                    />

                ) : (
                    <Avatar
                        source={require('../../assets/avatar.png')}
                    />

                )}
                <Name numberOfLines={1}>
                    {data?.autor}
                </Name>
            </Hearder>

            <ContentView>
                <Content>{data?.content}</Content>
            </ContentView>

            <Actions>
                <LikeButton onPress={() => handleLikePost(data.id, likePost)}>
                    <Like>
                        {likePost === 0 ? '' : likePost}
                    </Like>

                    <Icon
                        name={likePost === 0 ? "heart-plus-outline" : "cards-heart"}
                        size={20}
                        color="#E52246"
                    />
                </LikeButton>

                <TimePost>
                    {formatTimePost()}
                </TimePost>

            </Actions>

        </Container>
    );
}