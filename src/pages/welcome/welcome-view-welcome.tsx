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
  ThemeIcon,
  Title,
} from '@mantine/core';
import React from 'react';
import BreastFeeding2 from 'assets/images/breastfeeding2.jpg';
import styles from './welcome.module.css';
import { IconPointFilled } from '@tabler/icons-react';
import { useNavigate } from 'react-router';
import AppRoutes from 'shared/constants/app-routes';
import Pagination from './pagination';

export default function WelcomeViewWelcome() {
  const navigate = useNavigate();
  const next = () => {
    navigate(AppRoutes.welcomeName.absolute);
  };
  return (
    <>
      <Flex flex="1 1 33%" align={'end'}>
        <Image
          className={styles.image}
          radius="99999px"
          w="50dvw"
          maw="200px"
          src={BreastFeeding2}
          h="50dvw"
          mah="200px"
        />
      </Flex>
      <Flex flex="1 0 33%">
        <Stack align="center">
          <Title ff={'Dancing Script'} c="primary" size="3rem">
            Welcome
          </Title>
          <Stack gap="lg" align="center">
            <Text ta="center">
              A few settings to personalize things, <br /> then it's all yours!
            </Text>
            <Button onClick={next}>Let's get started!</Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex="1" align="end">
        <Pagination active={0} />
      </Flex>
    </>
  );
}
