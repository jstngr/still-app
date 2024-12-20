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
import BreastFeeding5 from 'assets/images/breastfeeding5.webp';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useSettingsContext } from 'service/settings.service';
import AppRoutes from 'shared/constants/app-routes';
import Pagination from './pagination';
import styles from './welcome.module.css';

export default function WelcomeViewSettings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    poopTrackerEnabled,
    onChangePoopTrackerEnabled,
    sleepTrackerEnabled,
    onChangeSleepTrackerEnabled,
  } = useSettingsContext();

  const next = () => {
    navigate(AppRoutes.welcomeFeeding.absolute);
  };
  return (
    <>
      <Flex flex="1 1 33%" align={'end'}>
        <Image
          className={styles.image}
          radius="99999px"
          w="50dvw"
          maw="200px"
          src={BreastFeeding5}
          h="50dvw"
          mah="200px"
        />
      </Flex>
      <Flex flex="1 0 33%">
        <Stack align="center">
          <Title ff={'Dancing Script'} c="primary" size="3rem">
            {t('welcome-view-settings-title')}
          </Title>
          <Stack gap="lg" align="center">
            <Text ta="center">{t('welcome-view-settings-description')}</Text>
            <Stack gap="sm">
              <Group gap="sm">
                <Flex w="38px" h="18px" justify="center">
                  <ThemeIcon variant="transparent" className={styles.checkIcon}>
                    <IconCircleDashedCheck />
                  </ThemeIcon>
                </Flex>
                <InputLabel>{t('welcome-view-settings-input-label-feeding')}</InputLabel>
              </Group>
              <Switch
                label={t('welcome-view-settings-input-label-pooping')}
                checked={poopTrackerEnabled}
                onChange={(event) => onChangePoopTrackerEnabled(event.currentTarget.checked)}
              />
              <Switch
                label={t('welcome-view-settings-input-label-sleeping')}
                checked={sleepTrackerEnabled}
                onChange={(event) => onChangeSleepTrackerEnabled(event.currentTarget.checked)}
              />
            </Stack>
            <Button onClick={next}>{t('welcome-view-settings-button-lable')}</Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex="1" align="end">
        <Pagination active={2} />
      </Flex>
    </>
  );
}
