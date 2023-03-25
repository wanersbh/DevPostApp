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
                <LikeButton>
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