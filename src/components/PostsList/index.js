import React from 'react';
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

export default function PostsList() {
    return (
        <Container>
            <Hearder>
                <Avatar
                    source={require('../../assets/avatar.png')}
                />
                <Name numberOfLines={1}>
                    Sujeito Programador
                </Name>
            </Hearder>

            <ContentView>
                <Content>Todo conteudo do post aqui</Content>
            </ContentView>

            <Actions>
                <LikeButton>
                    <Like>12</Like>
                    <Icon
                        name="heart-plus-outline"
                        size={20}
                        color="#E52246"
                    />
                </LikeButton>

                <TimePost>
                    há um minuto
                </TimePost>

            </Actions>

        </Container>
    );
}