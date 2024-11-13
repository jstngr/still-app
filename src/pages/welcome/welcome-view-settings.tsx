import {
  Button,
  Flex,
  Group,
  Image,
  InputLabel,
  Stack,
  Switch,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconCircleDashedCheck } from '@tabler/icons-react';
import Breastfeeding5 from 'assets/images/breastfeeding5.png';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSettingsContext } from 'service/settings.service';
import Pagination from './pagination';
import styles from './welcome.module.css';
import AppRoutes from 'shared/constants/app-routes';

export default function WelcomeViewSettings() {
  const navigate = useNavigate();
  const {
    poopTrackerEnabled,
    onChangePoopTrackerEnabled,
    sleepTrackerEnabled,
    onChangeSleepTrackerEnabled,
  } = useSettingsContext();

  const next = () => {
    navigate(AppRoutes.welcomeFinish.absolute);
  };
  return (
    <>
      <Flex flex="1 1 33%" align={'end'}>
        <Image
          className={styles.image}
          radius="99999px"
          w="50dvw"
          maw="200px"
          src={Breastfeeding5}
          h="50dvw"
          mah="200px"
        />
      </Flex>
      <Flex flex="1 0 33%">
        <Stack align="center">
          <Title ff={'Dancing Script'} c="primary" size="3rem">
            Features
          </Title>
          <Stack gap="lg" align="center">
            <Text ta="center">What do you want to do?</Text>
            <Stack gap="sm">
              <Group gap="sm">
                <Flex w="38px" h="18px" justify="center">
                  <ThemeIcon variant="transparent" className={styles.checkIcon}>
                    <IconCircleDashedCheck />
                  </ThemeIcon>
                </Flex>
                <InputLabel>Track feeding</InputLabel>
              </Group>
              <Switch
                label="Track pooping"
                checked={poopTrackerEnabled}
                onChange={(event) => onChangePoopTrackerEnabled(event.currentTarget.checked)}
              />
              <Switch
                label="Track sleeping"
                checked={sleepTrackerEnabled}
                onChange={(event) => onChangeSleepTrackerEnabled(event.currentTarget.checked)}
              />
            </Stack>
            <Button onClick={next}>Continue</Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex="1" align="end">
        <Pagination active={2} />
      </Flex>
    </>
  );
}
