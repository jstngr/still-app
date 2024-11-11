import {
  AppShell,
  Box,
  Button,
  Container,
  Flex,
  Group,
  Image,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import React from 'react';
import Baby2 from 'assets/images/Baby2.png';
import styles from './welcome.module.css';
import { IconPointFilled } from '@tabler/icons-react';
import { useSettingsContext } from 'service/settings.service';
import Pagination from './pagination';
import { useNavigate } from 'react-router';
import AppRoutes from 'shared/constants/app-routes';

export default function WelcomeViewName() {
  const navigate = useNavigate();
  const { onChangeBabyName, babyName } = useSettingsContext();

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeBabyName(event.target.value);
  };
  const next = () => {
    navigate(AppRoutes.welcomeSettings.absolute);
  };
  return (
    <>
      <Flex flex="1 1 33%" align={'end'}>
        <Image
          className={styles.image}
          radius="99999px"
          w="50dvw"
          maw="200px"
          src={Baby2}
          h="50dvw"
          mah="200px"
        />
      </Flex>
      <Flex flex="1 0 33%">
        <Stack align="center">
          <Title ff={'Dancing Script'} c="primary" size="3rem">
            Name
          </Title>
          <Stack gap="lg" align="center">
            <Text ta="center">Please provide the name of your little angel.</Text>
            <TextInput onChange={onChangeName} value={babyName} />
            <Button disabled={!babyName} onClick={next}>
              Continue
            </Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex="1" align="end">
        <Pagination active={1} />
      </Flex>
    </>
  );
}
